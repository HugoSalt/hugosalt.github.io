import BrandBarChart from "./BrandBarChart.js"

function pick(obj, keys) {
    return keys.map(k => k in obj ? {[k]: obj[k]} : {})
               .reduce((res, o) => Object.assign(res, o), {});
}

export default class ConsoleBar {

  constructor(colorsConsole) {
    this.nintendo = ["NES", "SNES", "N64", "GC", "Wii", "WiiU", "GB", "DS", "GBA", "3DS"]
    this.playstation = ["PS", "PS2", "PS3", "PS4", "PSP"]
    this.xbox = ["X360", "XOne", "XB"]
    this.atari = ["2600"]
    this.pc = ["PC"]

    this.colorsNintendo = pick(colorsConsole, this.nintendo)
    this.colorsPlaystation = pick(colorsConsole, this.playstation)
    this.colorsXbox = pick(colorsConsole, this.xbox)
    this.colorsAtari = pick(colorsConsole, this.atari)
    this.colorsPC = pick(colorsConsole, this.pc)

    // Creation of a dictionary representing the selected consoles
    this.consoles = this.nintendo.concat(this.playstation)
                            .concat(this.xbox)
                            .concat(this.atari)
                            .concat(this.pc)
    this.consoles_selected = {}
    for (let e of this.consoles) {
      this.consoles_selected[e] = true
    }

    this.margin = {top: 20, right: 20, bottom: 30, left: 200},
    this.width = 500 - this.margin.left - this.margin.right,
    this.height = 600 - this.margin.top - this.margin.bottom;

    this.total_distribution = []
    this.sum_brand_distribution = []

    this.nintendoBarChart = new BrandBarChart(this, this.nintendo, "nintendo_barChart_container",
                                       "Nintendo",
                                       this.get_brand_distribution(this.nintendo),
                                       this.colorsNintendo)

    this.playstationBarChart = new BrandBarChart(this, this.playstation, "playstation_barChart_container",
                                       "Playstation",
                                       this.get_brand_distribution(this.playstation),
                                       this.colorsPlaystation)

    this.xboxBarChart = new BrandBarChart(this, this.xbox, "xbox_barChart_container",
                                       "Xbox",
                                       this.get_brand_distribution(this.xbox),
                                       this.colorsXbox)

    this.atariBarChart = new BrandBarChart(this, this.atari, "atari_barChart_container",
                                       "Atari",
                                       this.get_brand_distribution(this.atari),
                                       this.colorsAtari)

    this.pcBarChart = new BrandBarChart(this, this.pc, "pc_barChart_container",
                                       "PC",
                                       this.get_brand_distribution(this.pc),
                                       this.colorsPC)

    this.tooltip = d3.select("body")
                     .append("div")
                     .attr("class", "tooltip")
                     .style("opacity", 0);
  }

  update(newData) {
    this.computeConsoleDistribution(newData)

    let values = this.sum_brand_distribution.map(e => e[1])
    let max_brand = Math.max(...values)
    let game_count = values.reduce((a, b) => a + b, 0);
    this.nintendoBarChart.update(this.get_brand_distribution(this.nintendo),
                                 this.sum_brand_distribution[0][1],
                                 max_brand,
                                 game_count)
    this.playstationBarChart.update(this.get_brand_distribution(this.playstation),
                                    this.sum_brand_distribution[1][1],
                                    max_brand,
                                    game_count)
    this.xboxBarChart.update(this.get_brand_distribution(this.xbox),
                                    this.sum_brand_distribution[2][1],
                                    max_brand,
                                    game_count)
    this.atariBarChart.update(this.get_brand_distribution(this.atari),
                                    this.sum_brand_distribution[3][1],
                                    max_brand,
                                    game_count)
    this.pcBarChart.update(this.get_brand_distribution(this.pc),
                                    this.sum_brand_distribution[4][1],
                                    max_brand,
                                    game_count)
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
    let brand = null
    switch (name){
      case "nintendo_barChart_container":
        brand = this.nintendo
        break;
      case "playstation_barChart_container":
        brand = this.playstation
        break;
      case "xbox_barChart_container":
        brand = this.xbox
        break;
      case "atari_barChart_container":
        brand = this.atari
        break;
      case "pc_barChart_container":
        brand = this.pc
        break;
      default:
        console.log("Unknown console : " + name)
        break;
    }

    for (let e of brand) {
      this.consoles_selected[e] = value
    }

    let platforms = this.consoles.reduce(
      (res, platform) => {
        if (this.consoles_selected[platform]) {
          return res.concat(platform)
        }
        return res
      }, [])

    this.dataManager.setPlatform(platforms)
  }

  update_console(platform, value) {
    this.consoles_selected[platform] = value

    let platforms = this.consoles.reduce(
      (res, platform) => {
        if (this.consoles_selected[platform]) {
          return res.concat(platform)
        }
        return res
      }, [])

    this.dataManager.setPlatform(platforms)
  }
}
