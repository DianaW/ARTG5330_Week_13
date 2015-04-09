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
    .scale(scaleY);

//Array bisector
//https://github.com/mbostock/d3/wiki/Arrays
var bisect = d3.bisector(function(d){return d.year}).left;


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

    svg.append('g')
        .attr('class','axis y')
        .call(axisY);

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
        .style('stroke-width','2px')
        .style('visibility','hidden');
    var yearText = plot
        .append('text')
        .attr('class','year')
        .attr('y',height)
        .attr('text-anchor','middle')
        .attr('dy',16);
    var valueText = plot
        .append('text')
        .attr('class','value');
    plot.append('rect')
        .attr('width',width)
        .attr('height',height)
        .style('fill-opacity',0)
        .on('mouseenter',onMouseEnter)
        .on('mousemove',onMouseMove)
        .on('mouseleave',onMouseLeave);

    function onMouseEnter(){
        target.style('visibility','visible');
    }

    function onMouseLeave(){
        target.style('visibility','hidden');
        yearText.text(null);
        valueText.text(null);

    }

    function onMouseMove(){
        var xy = d3.mouse(this);

        //target.attr('transform','translate('+xy[0]+','+xy[1]+')');

        //First, find the year
        var year = Math.floor(scaleX.invert(xy[0]));
        yearText
            .text(year)
            .attr('x',scaleX(year));

        //From the year, find the corresponding value in "series"
        var index = bisect(series,year),
            value = series[index].value;
        valueText
            .text(value)
            .attr('x',scaleX(year))
            .attr('y',scaleY(value));

        target
            .attr('cx',scaleX(year))
            .attr('cy',scaleY(value));
    }

}

function parse(d){
    return {
        id: d.ItemCode,
        name: d.ItemName,
        year:+d.Year,
        value:+d.Value
    }
}