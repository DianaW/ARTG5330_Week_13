//The most simple force layout example

var margin = {t:100,l:100,b:100,r:100},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var scaleX = d3.scale.linear().range([0,width]),
    scaleY = d3.scale.linear().range([height,0]);

var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width,0)
    .scale(scaleY)


//Import data
queue()
    .defer(d3.csv,'data/fao_coffee_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/fao_mate_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/fao_tea_world_1963_2013.csv',parse)
    .await(dataLoaded);

function dataLoaded(err,coffee,mate,tea){
    scaleX
        .domain( d3.extent(coffee,function(d){return d.year;}) );
    scaleY
        .domain([0, d3.max(coffee,function(d){return d.value;})*1.03 ]);

    draw(coffee);
}

function draw(series){
    var line = d3.svg.line()
        .x(function(d){return scaleX(d.year)})
        .y(function(d){return scaleY(d.value)})
        .interpolate('cardinal')
        .defined(function(d){return d.year && d.value});
    var area = d3.svg.area()
        .x(function(d){return scaleX(d.year)})
        .y(function(d){return scaleY(d.value)})
        .y0(height)
        .interpolate('cardinal')
        .defined(function(d){return d.year && d.value});

    var plot = svg.append('g')
        .attr('class','plot');
    plot.append('path')
        .datum(series)
        .attr('d',line)
        .attr('class','line');
    plot.append('path')
        .datum(series)
        .attr('d',area)
        .attr('class','area');
    var target = plot
        .append('circle')
        .attr('r',5)
        .attr('class','target')
        .attr('fill','white')
        .style('stroke','rgb(80,80,80')
        .style('visibility','hidden');
    var yearText = plot
        .append('text')
        .attr('class','year');
    var valueText = plot
        .append('text')
        .attr('class','value');

    svg.append('g')
        .attr('class','axis y')
        .call(axisY);


}

function parse(d){
    return {
        id: d.ItemCode,
        name: d.ItemName,
        year:+d.Year,
        value:+d.Value
    }
}