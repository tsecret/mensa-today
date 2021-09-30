const saveUser = (data: object) => {
    localStorage.setItem("user", JSON.stringify(data))
}

const loadUser = () => {
    try{
        return JSON.parse(localStorage.user)
    } catch(error){
        return null
    }
}

const translateWeekDay = (weekDay: string) => {
    switch (weekDay){
        case "Heute":
            return "Today";
        case "Montag":
            return "Monday";
        case "Dienstag":
            return "Tuesday";
        case "Mittwoch":
            return "Wednesday";
        case "Donnerstag":
            return "Thursday";
        case "Freitag":
            return "Friday";
        case "Samstag":
            return "Saturday";
        case "Sonntag":
            return "Sunday";    
    }
}

const combineItemName = (items: any[]) => {
    return items.map((item: any) => item.Name).join(", ")
}

export default {
    saveUser,
    loadUser,
    translateWeekDay,
    combineItemName
}