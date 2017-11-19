// Eg at http://c3js.org/samples/simple_xy.html
export default class LineChart {

  constructor(container_id, x_name, columns) {
    var chart = c3.generate({
      bindto: '#' + container_id,
      data: {
        x: x_name,
        columns: columns
      }
    });
  }

}
