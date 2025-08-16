export type Consultation = {
  id: number
  date: string
  time: string
  doctor: string
  specialty: string
  location: string
  canceled?: boolean
}
