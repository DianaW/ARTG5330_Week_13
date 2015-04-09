//The most simple force layout example

var margin = {t:30,l:250,b:20,r:250};

var width = $('.canvas').width()-margin.l-margin.r,
    height = 250;

var scaleX = d3.scale.linear().range([0,width]),
    scaleY = d3.scale.linear().range([height,0]);

var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width,0)
    .scale(scaleY);

//Array bisector
//https://github.com/mbostock/d3/wiki/Arrays
var bisect = d3.bisector(function(d){return d.year}).left;

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

//Custom event dispatcher
var dispatch = d3.dispatch('enter','yearChange','leave');

//Import data
queue()
    .defer(d3.csv,'data/fao_coffee_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/fao_mate_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/fao_tea_world_1963_2013.csv',parse)
    .await(dataLoaded);

function dataLoaded(err,coffee,mate,tea){

    //We want all the small multiples to have the same scales,
    //So we only do this once
    scaleX
        .domain( d3.extent(coffee,function(d){return d.year;}) );
    scaleY
        .domain([0, d3.max(coffee,function(d){return d.value;})*1.03 ]);

    d3.select('.canvas')
        .selectAll('.small-canvas')
        .data([
            {product:"coffee",series:coffee},
            {product:"mate",series:mate},
            {product:"tea",series:tea}
        ])
        .enter()
        .append('div')
        .attr('class','small-canvas')
        .style('height',(height+margin.t+margin.b)+'px')
        .append('svg')
        .attr('width',width+margin.l+margin.r)
        .attr('height',height+margin.t+margin.b)
        .append('g')
        .attr('transform','translate('+margin.l+','+margin.t+')')
        .each(function(d){
            draw(d,this)
        })

}

function draw(product,context){

    var svg = d3.select(context);

    svg.append('g')
        .attr('class','axis y')
        .call(axisY);

    var plot = svg.append('g')
        .attr('class','plot');
    plot.append('path')
        .datum(product.series)
        .attr('d',line)
        .attr('class','line');
    plot.append('path')
        .datum(product.series)
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
        .on('mouseenter',function(d){ dispatch.enter(); })
        .on('mousemove',function(d){
            var xy = d3.mouse(this);

            //First, find the year
            var year = Math.floor(scaleX.invert(xy[0]));

            dispatch.yearChange(year);
        })
        .on('mouseleave',function(d){
            dispatch.leave();
        });


    dispatch.on('enter.'+product.product, function(){
        target.style('visibility','visible');
    });
    dispatch.on('leave.'+product.product, function(){
        target.style('visibility','hidden');
        yearText.text(null);
        valueText.text(null);
    });
    dispatch.on('yearChange.'+product.product, function(year){
        yearText
            .text(year)
            .attr('x',scaleX(year));

        var index = bisect(product.series,year),
            value = product.series[index].value;
        valueText
            .text(value)
            .attr('x',scaleX(year))
            .attr('y',scaleY(value));

        target
            .attr('cx',scaleX(year))
            .attr('cy',scaleY(value));

    });

}

function parse(d){
    return {
        id: d.ItemCode,
        name: d.ItemName,
        year:+d.Year,
        value:+d.Value
    }
}