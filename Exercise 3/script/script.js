var margin = {t:100,l:100,b:100,r:100},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");


queue()
    .defer(d3.json, 'world.geojson')
    .await(function(err, data){

        console.log(data);
    });

