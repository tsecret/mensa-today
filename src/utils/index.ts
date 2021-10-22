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

const fetchID = (url: string) => {
    const data = url.split('/');
    return data[data.length - 1].slice(0, 6); 
}

const addToList = (arr: any[], item: any) => {
    if (!arr.includes(item)) arr.push(item);
    return arr;
}

const removeFromList = (arr: any[], item: any) => {
    return arr.filter((item_: any) => item_ !== item)
}

const getListFromDocs = (docs: any) => {
    let items: any[] = [];
    docs.forEach((doc: any) => {
        items.push(doc.data())
    });
    return items;
}

export default {
    saveUser,
    loadUser,
    translateWeekDay,
    combineItemName,
    fetchID,
    addToList,
    removeFromList,
    getListFromDocs
}