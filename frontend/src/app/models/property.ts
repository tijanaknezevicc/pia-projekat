export class Property {
  name = ""
  location = ""
  owner = ""
  dateBlocked = ""
  images: string[] = []
  services = ""
  pricing = {
    summer: 0,
    winter: 0
  }
  phone = ""
  comments: {
    user: string,
    text: string
  }[] = []
  ratings: number[] = []
  coordinates = {
    x: 0,
    y: 0
  }
}
