let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function getData() {
  return d3.json(url).then(function(data) {
    let names = data.names;
    let samples = data.samples;
    let metadata = data.metadata;
    return { names, samples, metadata };
  });
};

function init() {
  getData().then(function({ names, samples, metadata }) {
    let dropDown = d3.select("#selDataset");

    names.forEach((name) => {
      dropDown
        .append("option")
        .text(name)
        .property("value", name);
    });

    let hbar = [{
      x: samples[0].sample_values.slice(0,10).reverse(),
      y: samples[0].otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
      type: "bar",
      text: samples[0].otu_labels.slice(0,10).reverse(),
      hovertemplate: "%{text}<extra></extra>",
      orientation: "h"
    }];

    Plotly.newPlot("bar", hbar);

    let bubble = [{
        x: samples[0].otu_ids,
        y: samples[0].sample_values,
        mode: "markers",
        text: samples[0].otu_labels,
        marker: {
            color: samples[0].otu_ids,
            size: samples[0].sample_values
        }
        
    }];

    let layout = {
      xaxis: {
        title: 'OTU ID'
      }
    };
    

    Plotly.newPlot("bubble", bubble, layout);

    for (let key in metadata[0]) {
        let d_info = d3.select("#sample-metadata").append("p");
        let value = metadata[0][key];
        d_info.text(key + ": " + value);
      };

  });
};

function optionChanged(id) {
  getData().then(function({ names, samples, metadata }) {
    let i = names.indexOf(id);
    if (i >= 0) { 
      let update_hbar = {
        x: [samples[i].sample_values.slice(0,10).reverse()],
        y: [samples[i].otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse()],
        text: [samples[i].otu_labels.slice(0,10).reverse()],
        hovertemplate: "%{text}<extra></extra>",
      };

      let update_bubble = {
        x: [samples[i].otu_ids],
        y: [samples[i].sample_values],
        text: [samples[i].otu_labels],
        marker: [{
            color: samples[i].otu_ids,
            size: samples[i].sample_values
        }]
      };

      Plotly.restyle("bar", update_hbar);
      Plotly.restyle("bubble", update_bubble);

      d3.select("#sample-metadata")
        .selectAll("p")
        .remove();

      for (let key in metadata[i]) {
        let d_info = d3.select("#sample-metadata").append("p");
        let value = metadata[i][key];
        d_info.text(key + ": " + value);
      };

    };
  });
};

init();
