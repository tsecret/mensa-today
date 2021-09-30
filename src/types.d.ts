export interface User {
    name: string,
    id: string,
    email: string,
    card?: string,
    photo?: string,
    location?: string
}

export interface Location {
    Name: string,
    Code: string
}

export interface MealItem {
    Name: string,
    Light: number
}

export interface Dish {
    Name: string,
    Image: string,
    PriceStudents: string,
    PriceStaff: string,
    PriceGuests: string,
    Nutrition: string[],
    Note: string,
    Items: MealItem[],
    selected?: boolean
}

export interface Menu {
    Name: string,
    Dishes: Dish[]
}