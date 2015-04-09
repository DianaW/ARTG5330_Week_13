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

//Import data
queue()
    .defer(d3.csv,'data/fao_coffee_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/fao_mate_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/fao_tea_world_1963_2013.csv',parse)
    .await(dataLoaded);

function dataLoaded(err,coffee,mate,tea){
    console.log(coffee);
}

function parse(d){
    return {
        id: d.ItemCode,
        name: d.ItemName,
        year:+d.Year,
        value:+d.Value
    }
}