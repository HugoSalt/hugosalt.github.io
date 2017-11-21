import * as d3 from "d3";

export default class Banner {

  constructor(container_id) {
    d3.xml("./modules/Banner/banner.svg").mimeType("image/svg+xml").get((error, xml) => {

      if (error) throw error;
      document.getElementById(container_id).appendChild(xml.documentElement);

      let spaceInvaders = d3.select(`#${container_id} #space_invaders`);
      myTrans()

      function myTrans() {
        spaceInvaders.transition().ease(d3.easeLinear).duration(2000).style("transform", "translate(0px, -2.655306px)")
          .on("end", function() {
            d3.select(this).transition().ease(d3.easeLinear).duration(2000).style("transform", "translate(20px, -2.655306px)")
              .on("end", function() {
                myTrans();
              });
          });
      }

    });

  }

}
