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
    rating: number,
    text: string
  }[] = []
  coordinates = {
    x: 0,
    y: 0
  }
}
