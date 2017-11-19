// This Class contains all methods that process the Data
export default class DataProcessor {

  constructor(data) {
    // Load Data
    this.data = data
    // Find out minimun and maximum year
    this.minMaxYear = this.data.reduce(
      (minMax, game) => {
        if (isNaN(game.Year_of_Release)) return minMax;
        let releaseYear = parseInt(game.Year_of_Release);
        if (releaseYear <= minMax[0]) minMax[0] = releaseYear;
        if (releaseYear >= minMax[1]) minMax[1] = releaseYear;
        return minMax;
      }, [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])
    // Create scale
    this.yearScale = ["Year"];
    for (let y = this.minMaxYear[0]; y <= this.minMaxYear[1]; y++) this.yearScale.push(y);
  }

  // Get Console Popularity (sum of sales) over Years per Console and per Region
  // Region : "WORLD","EU","JP","NA" or "OTHER"
  // platform : list of the consoles as in the csv, for eg ["Wii","DS"]
  getConsolePopularityOverYears(region, platforms) {

    // Final data as C3 expect them http://c3js.org/samples/simple_xy.html
    let finalData = [];
    finalData.push(this.yearScale);

    // For each Platform create array of sales sum per year
    for (let platform of platforms) {
      let plaformArray = [platform];
      for (let year = this.minMaxYear[0]; year <= this.minMaxYear[1]; year++) {
        let thisYearSum = this.data.reduce(
          (sum, game) => {
            let releaseYear = parseInt(game.Year_of_Release);
            if ((releaseYear == year) && (game.Platform == platform)) sum += parseInt(game.Global_Sales);
            return sum;
          }, 0);
        plaformArray.push(thisYearSum)
      }
      finalData.push(plaformArray)
    }

    return finalData

  }

  getConsoleList() {
    return this.data.reduce(
      (platform_list, game) => {
        if (!platform_list.includes(game.Platform)) platform_list.push(game.Platform);
        return platform_list;
      }, []);
  }


}
