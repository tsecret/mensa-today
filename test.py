import requests



def fetchID(url: str) -> str:
    return url.split("/")[-1][:-4]


def downloadImage(url: str = None):
    res = requests.get(url)

    if res.status_code == 200:
        with open(f"images/{fetchID(url)}.png", 'wb') as handler:
            handler.write(res.content)
            return True

    return False

def main():
    # urls = []
    # days = requests.get('https://apistwdapp.klimala.de/diets/3.560').json()

    # for day in days:
    #     for meal in day["Dishes"]:
    #         urls.append(meal['Image'])


    for i in range(900000, 1000000):
        result = downloadImage(f"https://www3.hhu.de//stw-d//xml-export//img//{i}.jpg")
        print(f"{i} - {'Success' if result else 'Failed'}", end="\r")




if __name__ == "__main__":
    main()