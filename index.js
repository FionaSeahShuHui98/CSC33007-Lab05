let width = 1000, height = 600;

let svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox","0 0" + width + " " + height);

// Map and projection
let projection = d3.geoOrthographic()
    //.center([103.851959, 1.290270]) // London's longitude / latitude;
    //.scale(500)

let geopath = d3.geoPath().projection(projection);

let graticule = d3.geoGraticule()
      .step([10, 10]);

let time = Date.now();


//let singapore = [103.851959, 1.290270] // longitude = x, latitude = y

var cities = [
    {name: "Singapore", longitude: 103.851959, latitude: 1.290270},
    {name: "London", longitude: -0.118092, latitude: 51.509865},
    {name: "Tokyo", longitude: 139.839478, latitude: 35.652832}
]

// Load GeoJSON data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {

    svg.append("path")
        .datum({type: "Sphere"})
        .attr("id", "ocean")
        .attr("d", geopath)
        .attr("fill", "url(#oceanGradient)");

    // Draw the map
    svg.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
            .attr("d",  d => geopath(d))
            .attr("class", "country")
    
        .on("mouseover", (event, d) => {
            d3.select(".tooltip")
            .text(d.properties.name)
            .style("position", "absolute")
            .style("background", "#fff")
            .style("font-family", "Arial")
            .style("font-size", "12")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
        
            d3.select(event.currentTarget) 
            //.style("stroke", "red")
            .classed("selected",true)
        })
        .on("mouseout", (event, d) => {
            d3.select(".tooltip")
            .text("")
             d3.select(event.currentTarget) 
            //.style("stroke", "red")
            .classed("selected",false)
        })

        svg.append("g")
        .attr("id", "graticules")
        .selectAll("path")
        .data([graticule()])
        .enter()
        .append("path")
        .attr("d", d => geopath(d))
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("stroke-width", 0.2);
    
        d3.timer(function() {
            let angle = (Date.now() - time) * 0.02;
            projection.rotate([angle, 0, 0]);
            svg.select("g#countries").selectAll("path")
                .attr("d", geopath.projection(projection));
            svg.select("g#graticules").selectAll("path")
                .attr("d", geopath.projection(projection));
            svg.select("g#cities").selectAll("circle")
                .attr("cx", d => projection([d.longitude, d.latitude])[0])
                .attr("cy", d => projection([d.longitude, d.latitude])[1])
                .attr("visibility", d => {
                    var point = {type: 'Point', coordinates: [d.longitude, d.latitude]};
                    if (geopath(point) == null) {
                        return "hidden";
                    } else { 
                        return "visible";
                    }
                });
                      
        });
        
    svg.append("g")
        .attr("id","cities")
        .selectAll("circle")
        .data(cities)
        .enter()
        .append("circle")
        .attr("cx", d=> projection([d.longitude, d.latitude])[0])
        .attr("cy", d=> projection([d.longitude, d.latitude])[1])
        .attr("r",5)
        .attr("fill","yellow");

    //svg.append("circle")
        //.attr("cx", projection(singapore)[0])
        //.attr("cy", projection(singapore)[1])
        //.attr("r", 5)
        //.attr("fill", "red"); 
    
               
    
})