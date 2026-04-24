// src/lib/constants.ts

export interface LocationData {
	[constituency: string]: string[];
}

export const NAIROBI_LOCATIONS: LocationData = {
	Westlands: ['Kitisuru', 'Parklands/Highridge', 'Karura', 'Kangemi', 'Mountain View'],
	'Dagoretti North': ['Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Kabiro'],
	'Dagoretti South': ['Mutu-ini', 'Ngando', 'Riruta', 'Uthiru/Ruthimitu', 'Waithaka'],
	"Lang'ata": ['Karen', 'Nairobi West', 'Mugumo-ini', 'South C', 'Nyayo Highrise'],
	Kibra: ['Laini Saba', 'Lindi', 'Makina', 'Woodley/Kenyatta Golf Course', 'Sarang\'ombe'],
	Roysambu: ['Githurai', 'Kahawa West', 'Zimmerman', 'Roysambu', 'Kahawa'],
	Kasarani: ['Clay City', 'Mwiki', 'Kasarani', 'Njiru', 'Ruai'],
	Ruaraka: ['Babadogo', 'Utalii', 'Mathare North', 'Lucky Summer', 'Korogocho'],
	'Embakasi South': ['Imara Daima', 'Kwa Njenga', 'Kwa Reuben', 'Pipeline', 'Kware'],
	'Embakasi North': ['Kariobangi North', 'Dandora Area I', 'Dandora Area II', 'Dandora Area III', 'Dandora Area IV'],
	'Embakasi Central': ['Kayole North', 'Kayole Central', 'Kayole South', 'Komarock', 'Matopeni/Spring Valley'],
	'Embakasi East': ['Upper Savannah', 'Lower Savannah', 'Embakasi', 'Utawala', 'Mihango'],
	'Embakasi West': ['Umoja I', 'Umoja II', 'Mowlem', 'Kariobangi South', 'Maringo/Hamza'],
	Makadara: ['Maringo/Hamza', 'Viwandani', 'Harambee', 'Makongeni'],
	Kamukunji: ['Pumwani', 'Eastleigh North', 'Eastleigh South', 'Airbase', 'California'],
	Starehe: ['Nairobi Central', 'Ngara', 'Pangani', 'Ziwani/Kariokor', 'Landimawe', 'Nairobi South'],
	Mathare: ['Hospital', 'Mabatini', 'Huruma', 'Ngei', 'Mlango Kubwa', 'Kiamaiko']
};