export enum Fields {
  Name = "name",
  NameLong = "nameLong",
  City = "city",
  Country = "country",
  University = "university",
  Faculty = "faculty",
  Year = "year",
  Age = "age",
  Passport = "passport",
  Location = "location",
  // BirthDate = 'birthDate', **
  Text = "text",
}

type Field = {
  field: string;
  name: string;
  type: Fields | null;
  noQuestions?: boolean;
  example?: string;
  resultMessage?: string;
};
type Grant = {
  id: number;
  title: string;
  additionalInfo: string[];
  description: string;
  image: string;
  date: string;
  location: string;
  description_long: string;
  organizer: string;
  age: string;
  foreigners: string;
  fields: Field[];
};

import mockImage from "../assets/mockImage.jpg";

export const grants: Grant[] = [
  {
    id: 1,
    title: 'Международный конкурс "Вселенная Искусства"',
    additionalInfo: ["01.11.2022 - 30.06.2023", "г. Москва"],
    description:
      "Регистрация закрывается в 08:52 30.06.2023 по московскому времени",
    image: mockImage,
    date: "1 ноября 2022 - 30 июня 2023",
    location: "Центральный федеральный округ, Москва г, г. Москва",
    description_long:
      'Конкурс для команд и индивидуальных цифровых художников и ИТ-команд, работающих с AR / VR / CGI / motion design, которые хотят создавать новые дизайнерские объекты различных направлений, включать их в цифровые вселенные на основе производительного движка "ВИ", создавать новые музеи и легенды, а также новые персонализированные мультиформатные общественные пространства в рамках Вселенной Искусства',
    organizer:
      "АВТОНОМНАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ЦЕНТР РЕАЛИЗАЦИИ ПРОСВЕТИТЕЛЬСКИХ, КУЛЬТУРНЫХ, СПОРТИВНЫХ И СОЦИАЛЬНЫХ ПРОЕКТОВ «ЗВЕЗДА»",
    age: "14 - 35",
    foreigners: "Иностранные граждане, проживающие за рубежом",
    fields: [
      {
        field: "name",
        type: Fields.NameLong,
        name: "Ф.И.О.",
        example: "Иванов Иван Иванович",
        resultMessage: "Введенное Ф.И.О:",
      },
      {
        field: "education",
        type: null,
        name: "образование",
        noQuestions: true,
      },
      {
        field: "educationCountry",
        type: Fields.Country,
        name: "cтрану",
        neutralForm: "страна",
        example: "Россия",
        resultMessage: "Введенная страна:",
      },
      {
        field: "educationCity",
        type: Fields.City,
        name: "город",
        example: "Москва",
        resultMessage: "Введенный город:",
      },

      {
        field: "educationUniversity",
        type: Fields.University,
        name: "университет",
        example: "МГУ",
        resultMessage: "Введенный университет:",
      },
      {
        field: "educationFaculty",
        type: Fields.Faculty,
        name: "факультет",
        example: "Физический",
        resultMessage: "Введенный факультет:",
      },
      {
        field: "educationEndYear",
        type: Fields.Year,
        name: "год окончания",
        example: "2022",
        resultMessage: "Введенный год:",
      },
    ],
  },
  {
    id: 2,
    title: "Грант для научных исследований в области биологии",
    additionalInfo: [
      "01.09.2023 - 31.08.2024",
      "открыт для заявок из любых стран",
    ],
    description:
      "Для получения гранта необходимо предоставить научный проект на конкурс",
    image: "https://source.unsplash.com/random/800x600?sig=2",
  },
  {
    id: 3,
    title: "Грант для молодых предпринимателей",
    additionalInfo: ["01.07.2023 - 30.06.2024", "открыт для заявок из России"],
    description:
      "Новая программа финансирования молодых предпринимателей. Сумма гранта - до 5 млн. рублей",
    image: "https://source.unsplash.com/random/800x600?sig=3",
  },
  {
    id: 4,
    title: "Грант для исследований в области информационных технологий",
    additionalInfo: [
      "01.01.2023 - 31.12.2023",
      "открыт для заявок из любых стран",
    ],
    description:
      "Грант для научных исследований в области информационных технологий. Сумма гранта - до 1 млн. долларов США",
    image: "https://source.unsplash.com/random/800x600?sig=4",
  },
  {
    id: 5,
    title: "Грант для научных исследований в области психологии",
    additionalInfo: [
      "01.10.2023 - 30.09.2024",
      "открыт для заявок из России и СНГ",
    ],
    image: "https://source.unsplash.com/random/800x600?sig=5",
    description: "Грант для научных исследований в области психологии.",
  },
  {
    id: 6,
    title: "Грант для исследований в области энергетики",
    additionalInfo: [
      "01.05.2023 - 30.04.2024",
      "открыт для заявок из Европейских стран",
    ],
    description:
      "Грант для научных исследований в области энергетики. Сумма гранта - до 500 тысяч евро",
    image: "https://source.unsplash.com/random/800x600?sig=6",
  },

  {
    id: 7,
    title: "Грант для исследований в области искусственного интеллекта",
    additionalInfo: [
      "01.11.2023 - 31.10.2024",
      "открыт для заявок из США, Канады и Австралии",
    ],
    description:
      "Грант для научных исследований в области искусственного интеллекта. Сумма гранта - до 2 млн. долларов США",
    image: "https://source.unsplash.com/random/800x600?sig=7",
  },

  {
    id: 8,
    title: "Грант для исследований в области геологии",
    additionalInfo: [
      "01.03.2023 - 28.02.2024",
      "открыт для заявок из любых стран",
    ],
    description:
      "Грант для научных исследований в области геологии. Сумма гранта - до 800 тысяч долларов США",
    image: "https://source.unsplash.com/random/800x600?sig=8",
  },
  {
    id: 21,
    title: "Грант для исследований в области космических технологий",
    additionalInfo: [
      "01.07.2023 - 30.06.2024",
      "открыт для заявок из США, Европы и Японии",
    ],
    description:
      "Грант для научных исследований в области космических технологий. Сумма гранта - до 3 млн. долларов США",
    image: "https://source.unsplash.com/random/800x600?sig=21",
  },

  {
    id: 22,
    title: "Грант для исследований в области математики",
    additionalInfo: [
      "01.01.2023 - 31.12.2023",
      "открыт для заявок из любых стран",
    ],
    description:
      "Грант для научных исследований в области математики. Сумма гранта - до 1 млн. долларов США",
    image: "https://source.unsplash.com/random/800x600?sig=22",
  },

  {
    id: 23,
    title: "Грант для исследований в области социологии",
    additionalInfo: [
      "01.09.2023 - 31.08.2024",
      "открыт для заявок из России, СНГ и Восточной Европы",
    ],
    description:
      "Грант для научных исследований в области социологии. Сумма гранта - до 500 тысяч долларов США",
    image: "https://source.unsplash.com/random/800x600?sig=23",
  },

  {
    id: 24,
    title: "Грант для исследований в области истории и культуры",
    additionalInfo: [
      "01.05.2023 - 30.04.2024",
      "открыт для заявок из любых стран",
    ],
    description:
      "Грант для научных исследований в области истории и культуры. Сумма гранта - до 1 млн. долларов США",
    image: "https://source.unsplash.com/random/800x600?sig=24",
  },
];
