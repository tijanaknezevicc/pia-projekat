export class Reservation {
  dateBeg = new Date()
  dateEnd = new Date()
  dateReserved = new Date()
  propertyName = ""
  propertyLocation = ""
  owner = ""
  renter = ""
  guests = {
    adults: 0,
    children: 0
  }
  requests = ""
  approved = false
  pending = true
  rating = 0
  comment = ""
  rejectionReason = ""
}
