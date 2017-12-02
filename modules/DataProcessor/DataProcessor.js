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
    // Stop at 2015
    for (let y = this.minMaxYear[0]; y <= this.minMaxYear[1] - 2; y++) this.yearScale.push(y);
  }

  // ---------------------------------------------------------------------------
  // CONSOLE WAR
  // ---------------------------------------------------------------------------

  // Get Console Sales (sum of sales) over Years per Console and per Region
  // region : "Global","EU","JP","NA" or "Other"
  // platform : list of the consoles as in the csv, for eg ["Wii","DS"]
  getConsoleSalesYears(platforms, region) {
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
            if ((releaseYear == year) && (game.Platform == platform)) sum += parseFloat(game[region + "_Sales"]);
            return sum;
          }, 0);
        plaformArray.push(thisYearSum);
      }
      finalData.push(plaformArray);
    }
    return finalData
  }

  // Get Number Release over Year per Console
  // platform : list of the consoles as in the csv, for eg ["Wii","DS"]
  getConsoleReleaseYears(platforms) {
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
            if ((releaseYear == year) && (game.Platform == platform)) sum += 1;
            return sum;
          }, 0);
        plaformArray.push(thisYearSum);
      }
      finalData.push(plaformArray);
    }
    return finalData
  }

  // Get Sales for each genre per Console
  // platform : list of the genre as in the csv, for eg ["Sports", "Platform"]
  getConsoleGenreSales(genreList, platformList) {
    // Final data as C3 expect them http://c3js.org/samples/chart_bar_stacked.html
    let finalData = [];
    // For each Platform create array of sales sum per year
    for (let genre of genreList) {
      let genreArray = [genre];
      for (let platform of platformList) {
        let thisPlatformSum = this.data.reduce(
          (sum, game) => {
            if ((game.Genre == genre) && (game.Platform == platform)) sum += parseFloat(game.Global_Sales);
            return sum;
          }, 0);
        genreArray.push(thisPlatformSum);
      }
      finalData.push(genreArray);
    }
    return finalData
  }

  // ---------------------------------------------------------------------------
  // PUBLISHER WAR
  // ---------------------------------------------------------------------------
  getPublisherList() {
    return this.data.reduce(
      (publisher_list, game) => {
        if (!publisher_list.includes(game.Publisher)) publisher_list.push(game.Publisher);
        return publisher_list;
      }, []);
  }

  // Get top 10 publishers total sales
  // region : "Global","EU","JP","NA" or "Other"
  // Returns [[EA, Blizzard, Ubi,...],["Sales", 123, 110.5, 98.8,...]]
  getTop10PublisherSales(region) {
    let publisherList = this.getPublisherList();
    let finalData = [];
    // Get [["Ubi","384.3"]["EA", 343.4],...] tuples
    for (let publisher of publisherList) {
      let thisPublisherSum = this.data.reduce(
        (sum, game) => {
          if (game.Publisher == publisher) sum += parseFloat(game[region + "_Sales"]);
          return sum;
        }, 0);
      let publisherSales = [publisher, thisPublisherSum];
      finalData.push(publisherSales);
    }
    // Sort those tuples
    let sorted = finalData.sort(function(a, b) {
      return b[1] - a[1];
    });
    // Return top 10 only
    let top10Sorted = sorted.slice(0, 10);
    // Return Column and category
    let cat = top10Sorted.reduce((acc, value) => {
      acc.push(value[0])
      return acc;
    }, []);
    let col = top10Sorted.reduce((acc, value) => {
      acc.push(value[1])
      return acc;
    }, []);
    col.unshift("Sales");
    return [cat, col];
  }

  // Get Number Sales over Year per Publisher and per Region
  // region : "Global","EU","JP","NA" or "Other"
  // publishers : ["Ubisoft", "EA", ...]
  getPublisherSalesYear(region, publishers) {
    let finalData = [];
    finalData.push(this.yearScale);
    // For each Publisher create array of sales sum per year
    for (let publisher of publishers) {
      let publisherArray = [publisher];
      for (let year = this.minMaxYear[0]; year <= this.minMaxYear[1]; year++) {
        let thisYearSum = this.data.reduce(
          (sum, game) => {
            let releaseYear = parseInt(game.Year_of_Release);
            if ((releaseYear == year) && (game.Publisher == publisher)) sum += parseFloat(game[region + "_Sales"]);
            return sum;
          }, 0);
        publisherArray.push(thisYearSum);
      }
      finalData.push(publisherArray);
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

  getGenreList() {
    return this.data.reduce(
      (genre_list, game) => {
        if (game.Genre != "" && !genre_list.includes(game.Genre)) genre_list.push(game.Genre);
        return genre_list;
      }, []);
  }
}
