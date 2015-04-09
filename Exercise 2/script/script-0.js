//Fun with dispatch

$('.canvas').height(500);

var margin = {t:100,l:100,b:100,r:100}, //overall margin
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");


//Approach 1: What's the drawback of this?
/*var g1 = svg.append('g')
    .attr('class','g-1')
    .attr('transform','translate('+width/4+',100)')
g1
    .append('circle')
    .attr('r',50)
    .style('fill','white')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','2px');
g1
    .append('circle')
    .attr('class','interactive')
    .attr('r',20)
    .style('stroke-dasharray','4px 2px')
    .style('fill','none')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','1px');
g1.on('mousemove',function(){
    var xy = d3.mouse(this);
    var r = Math.sqrt(xy[0]*xy[0] + xy[1]*xy[1]);

    d3.select(this).select('.interactive').attr('r',r);
    g2.select('.interactive').attr('r',r);
})

//circle2
var g2 = svg.append('g')
    .attr('class','g-2')
    .attr('transform','translate('+width*2/4+',100)')
g2
    .append('circle')
    .attr('r',50)
    .style('fill','white')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','2px');
g2
    .append('circle')
    .attr('class','interactive')
    .attr('r',20)
    .style('stroke-dasharray','4px 2px')
    .style('fill','none')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','1px');

//circle3
var g3 = svg.append('g')
    .attr('class','g-3')
    .attr('transform','translate('+width*3/4+',100)')
g3
    .append('circle')
    .attr('r',50)
    .style('fill','white')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','2px');
g3
    .append('circle')
    .attr('r',20)
    .attr('class','interactive')
    .style('stroke-dasharray','4px 2px')
    .style('fill','none')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','1px');*/

//Approach 2
var groups = svg.selectAll('.circle-group')
    .data([1,2,3])
    .enter()
    .append('g')
    .attr('class','circle-group')
    .attr('transform',function(d){return 'translate('+width*d/4+',100)'})

groups
    .append('circle')
    .attr('r',50)
    .style('fill','white')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','2px');
groups
    .append('circle')
    .attr('r',20)
    .attr('class','interactive')
    .style('stroke-dasharray','4px 2px')
    .style('fill','none')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','1px');

//Approach 3
var groups = svg.selectAll('.circle-group')
    .data([1,2,3])
    .enter()
    .append('g')
    .attr('class','circle-group')
    .attr('transform',function(d){return 'translate('+width*d/4+',100)'})

groups
    .append('circle')
    .attr('r',50)
    .style('fill','white')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','2px');
groups
    .append('circle')
    .attr('r',20)
    .attr('class','interactive')
    .style('stroke-dasharray','4px 2px')
    .style('fill','none')
    .style('stroke','rgb(80,80,80')
    .style('stroke-width','1px');
