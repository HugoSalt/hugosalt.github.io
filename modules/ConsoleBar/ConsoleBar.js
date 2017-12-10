import BrandBarChart from "./BrandBarChart.js"

export default class ConsoleBar {

  constructor(container_id, dataManager) {
    this.nintendo = ["NES", "SNES", "N64", "GC", "Wii", "WiiU", "GB", "DS", "GBA", "3DS"]
    this.playstation = ["PS", "PS2", "PS3", "PS4", "PSP"]
    this.xbox = ["X360", "XOne", "XB"]
    this.atari = ["2600"]
    this.pc = ["PC"]

    this.consoles_selected = [true, true, true, true, true]

    this.margin = {top: 20, right: 20, bottom: 30, left: 200},
    this.width = 500 - this.margin.left - this.margin.right,
    this.height = 600 - this.margin.top - this.margin.bottom;
    this.svg = d3.select('#' + container_id)
                 .append("svg")
                 .attr("width", this.width + this.margin.left + this.margin.right)
                 .attr("height", this.height + this.margin.top + this.margin.bottom)
                 .append("g")
                 .attr("transform",
                         "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.total_distribution = []
    this.sum_brand_distribution = []

    this.nintendoBarChart = new BrandBarChart(this, "nintendo_barChart_container",
                                       "Nintendo",
                                       this.get_brand_distribution(this.nintendo))

    this.playstationBarChart = new BrandBarChart(this, "playstation_barChart_container",
                                       "Playstation",
                                       this.get_brand_distribution(this.nintendo))

    this.xboxBarChart = new BrandBarChart(this, "xbox_barChart_container",
                                       "Xbox",
                                       this.get_brand_distribution(this.nintendo))

    this.atariBarChart = new BrandBarChart(this, "atari_barChart_container",
                                       "Atari",
                                       this.get_brand_distribution(this.nintendo))

    this.pcBarChart = new BrandBarChart(this, "pc_barChart_container",
                                       "PC",
                                       this.get_brand_distribution(this.nintendo))
  }

  update(newData) {
    this.computeConsoleDistribution(newData)

    let max_brand = Math.max(...this.sum_brand_distribution.map(e => e[1]))
    this.nintendoBarChart.update(this.get_brand_distribution(this.nintendo),
                                 this.sum_brand_distribution[0][1],
                                 max_brand)
    this.playstationBarChart.update(this.get_brand_distribution(this.playstation),
                                    this.sum_brand_distribution[1][1],
                                    max_brand)
    this.xboxBarChart.update(this.get_brand_distribution(this.xbox),
                                    this.sum_brand_distribution[2][1],
                                    max_brand)
    this.atariBarChart.update(this.get_brand_distribution(this.atari),
                                    this.sum_brand_distribution[3][1],
                                    max_brand)
    this.pcBarChart.update(this.get_brand_distribution(this.pc),
                                    this.sum_brand_distribution[4][1],
                                    max_brand)
  }

  /*
    For each platform specified, compute the number of existing games
  */
  computeConsoleDistribution(newData) {
    let nintendo = 0
    let playstation = 0
    let atari = 0
    let xbox = 0
    let pc = 0

    let keys = this.nintendo.concat(this.playstation)
                            .concat(this.xbox)
                            .concat(this.atari)
                            .concat(this.pc)

    let distribution_dict = {}

    for (let e of keys) {
      distribution_dict[e] = 0
    }

    for (let e of newData) {
      distribution_dict[e.Platform] += 1
    }

    let distribution = []

    for (let i = 0 ; i < keys.length ; ++i) {
      distribution.push([keys[i], distribution_dict[keys[i]]])
    }

    for (let e of distribution) {
      if (e[0] == "NES" ||
          e[0] == "SNES" ||
          e[0] == "N64" ||
          e[0] == "GC" ||
          e[0] == "Wii" ||
          e[0] == "WiiU" ||
          e[0] == "GB" ||
          e[0] == "DS" ||
          e[0] == "GBA" ||
          e[0] == "3DS") {
        nintendo += e[1]
      }
      else if (e[0] == "PS" ||
               e[0] == "PS2" ||
               e[0] == "PS3" ||
               e[0] == "PS4" ||
               e[0] == "PSP") {
        playstation += e[1]
      }
      else if (e[0] == "2600"){
        atari += e[1]
      }
      else if (e[0] == "X360" ||
               e[0] == "XOne" ||
               e[0] == "XB") {
        xbox += e[1]
      }
      else if (e[0] == "PC") {
        pc += e[1]
      }
    }

    this.total_distribution = distribution
    this.sum_brand_distribution = [["Nintendo", nintendo],
                                   ["Playstation", playstation],
                                   ["XBox", xbox],
                                   ["Atari", atari],
                                   ["PC", pc]]
  }

    get_brand_distribution(brand) {
      return this.total_distribution.filter(e => brand.includes(e[0]) )
    }

    setDataManager(dataManager) {
      this.dataManager = dataManager
    }

    update_brand(name, value) {
      switch (name){
        case "nintendo_barChart_container":
          this.consoles_selected[0] = value;
          break;
        case "playstation_barChart_container":
          this.consoles_selected[1] = value;
          break;
        case "xbox_barChart_container":
          this.consoles_selected[2] = value;
          break;
        case "atari_barChart_container":
          this.consoles_selected[3] = value;
          break;
        case "pc_barChart_container":
          this.consoles_selected[4] = value;
          break;
        default:
          console.log("Unknown console : " + name)
          break;
      }


      let platforms = []
      if (this.consoles_selected[0] ) {
        platforms = platforms.concat(this.nintendo)
      }
      if (this.consoles_selected[1]) {
        platforms = platforms.concat(this.playstation)
      }
      if (this.consoles_selected[2]) {
        platforms = platforms.concat(this.xbox)
      }
      if (this.consoles_selected[3]) {
        platforms = platforms.concat(this.atari)
      }
      if (this.consoles_selected[4]) {
        platforms = platforms.concat(this.pc)
      }

      this.dataManager.setPlatform(platforms)
    }
}
