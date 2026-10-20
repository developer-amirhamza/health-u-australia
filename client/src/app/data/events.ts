import cookingImage from 'assets/images/events/cooking class.png'
import bunnyImage from 'assets/images/events/Bunny and Turtle Walk-5-3-26.png'
import { cooking_gallery } from 'config/page'

export type SiteEvent = {
  id: string; status: 'current' | 'past'; title: string; timeHeading: string; time: string; date: string;
  locationHeading: string; location: string; intro: string[]; overview: string[]; waiver: string;
  image: string; galleryTitle: string; gallery: string[]; audience: string[];
}
export const defaultEvents: SiteEvent[] = [
  { id: 'cooking-class', status: 'current', title: 'Health U Australia - Cooking Class', timeHeading: 'Class Time & Date', time: '1:00 pm - 3:00 pm', date: 'Every Wednesday', locationHeading: 'Location:', location: 'SIL Bowden Street Ryde NSW 2112', intro: ['Healthy eating starts with confidence in the kitchen. 👩‍🍳', 'Join our cooking class to learn simple, nutritious recipes that bring joy back to mealtimes. Cook, connect, and discover how good food can make you feel.'], overview: [], waiver: '', image: '/events/cooking-class', galleryTitle: 'Cooking Gallery – Health U Australia', gallery: cooking_gallery.map((_, index) => `/events/cooking-${index + 1}`), audience: ['NDIS Participants', 'Carers & Families'] },
  { id: 'bunny-and-turtle-walk', status: 'past', title: 'Bunny and Turtle Walk - NDIS Networking', timeHeading: 'Event Time & Date', time: '10:30 AM - 12 PM', date: 'Wednesday, March 25', locationHeading: 'Start location:', location: '120–122 Bowden Street, Meadowbank', intro: ['🚶‍♀️Walking along the Parramatta River', 'A cold beverage will be provided on the day.'], overview: ['Step away from the desk and join a relaxed Parramatta River walk connecting professionals across the disability sector.', 'Join Get Picked Up, MyLife Housing and Health U Support Services for a relaxed networking walk along the Parramatta River, bringing together professionals across the disability and community services sector.', 'This event is about connection, conversation and wellbeing. Whether you prefer a faster pace or a slower walk-and-talk, the Bunny & Turtle Walk allows everyone to participate in a way that suits them.', 'Starting from Meadowbank, we’ll take a gentle walk along the river, creating space to step away from the desk, enjoy the outdoors, and connect with others across the disability and community services sector.'], waiver: 'By participating in the Bunny & Turtle Walk, you acknowledge that this is a voluntary activity involving light physical movement. You are responsible for your own health, safety, and wellbeing during the event. Event hosts and partner organisations accept no liability for injury, loss, or damage incurred as a result of participation. Please seek medical advice if you have any concerns about taking part in physical activity.', image: '/events/bunny-walk', galleryTitle: '', gallery: [], audience: [] },
]
export function eventImage(src: string) {
  if (src === '/events/cooking-class') return cookingImage
  if (src === '/events/bunny-walk') return bunnyImage
  const match = /^\/events\/cooking-(\d+)$/.exec(src)
  if (match) return cooking_gallery[Number(match[1]) - 1] ?? cookingImage
  return src
}
