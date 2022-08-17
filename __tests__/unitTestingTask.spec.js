const unitTestingTask = require("../unitTestingTask");

describe("unit testing task", () => {
  const dateToFormatNight = "Mon Aug 15 2022 02:09:09:012 GMT+0200";
  const dateToFormatMorning = "Mon Aug 15 2022 09:09:09:012 GMT+0200";
  const dateToFormatAfternoon = "Mon Aug 15 2022 14:09:09:012 GMT+0200";
  const dateToFormatEvening = "Mon Aug 15 2022 19:19:19:123 GMT+0200";
  const formattedDate = "2022-08-15";
  const format = "YYYY-MM-dd";
  const belarusianLang = {
    _months: {
      nominative:
        "студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split(
          "_"
        ),
      accusative:
        "студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасеня_кастрычніка_лістапада_снежня".split(
          "_"
        ),
    },
    months: function (date, format) {
      var nounCase = /dd?\s*MMMM?/.test(format) ? "accusative" : "nominative";
      return this._months[nounCase][date.getMonth()];
    },
    _monthsShort: "сту_лют_сак_кра_тра_чэр_ліп_жні_вер_кас_лис_сне".split("_"),
    monthsShort: function (date) {
      return this._monthsShort[date.getMonth()];
    },
    weekdays: "нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split(
      "_"
    ),
    weekdaysShort: "ндз_пн_аўт_сер_чц_пт_сб".split("_"),
    weekdaysMin: "ндз_пн_аўт_сер_чц_пт_сб".split("_"),
    meridiem: function (hour) {
      if (hour < 4) {
        return "ночы";
      } else if (hour < 12) {
        return "раніцы";
      } else if (hour < 17) {
        return "дня";
      } else {
        return "вечара";
      }
    },
  };

  test("it should throw an error when format and date did not provide", () => {
    expect(() => unitTestingTask()).toThrow(Error);
  });

  test("it should throw an error when format did not provide and date provided", () => {
    expect(() => unitTestingTask(_, dateToFormatMorning)).toThrow(Error);
  });

  test("it should throw an error when format provided and date did not provide", () => {
    expect(() => unitTestingTask(format, {})).toThrow(Error);
  });

  test("it should return formatted date when format and date provided", () => {
    expect(unitTestingTask(format, dateToFormatMorning)).toEqual(formattedDate);
  });

  test("it should return formatted date with custom formatting", () => {
    unitTestingTask.register("longDate", "d MMMM");
    expect(unitTestingTask("longDate", dateToFormatMorning)).toEqual(
      "15 August"
    );
  });

  describe("format date according to `format` string", () => {
    test("it should return format string if it does not exist in tokens list", () => {
      expect(unitTestingTask("WWWW", dateToFormatMorning)).toEqual("WWWW");
    });

    test("it should return last 2 digit of year", () => {
      expect(unitTestingTask("YY", dateToFormatMorning)).toEqual("22");
    });

    test("it should return short name of month", () => {
      expect(unitTestingTask("MMM", dateToFormatMorning)).toEqual("Aug");
    });

    test("it should return number of month in year without zero-padding", () => {
      expect(unitTestingTask("M", dateToFormatMorning)).toEqual("8");
    });

    test("it should return full name of day", () => {
      expect(unitTestingTask("DDD", dateToFormatMorning)).toEqual("Monday");
    });

    test("it should return short name of day", () => {
      expect(unitTestingTask("DD", dateToFormatMorning)).toEqual("Mon");
    });

    test("it should return min name of day", () => {
      expect(unitTestingTask("D", dateToFormatMorning)).toEqual("Mo");
    });

    test("it should return zero-padded hour in 24-hr format", () => {
      expect(unitTestingTask("HH", dateToFormatMorning)).toEqual("09");
      expect(unitTestingTask("HH", dateToFormatEvening)).toEqual("19");
    });

    test("it should return hour in 24-hr format", () => {
      expect(unitTestingTask("H", dateToFormatMorning)).toEqual("9");
      expect(unitTestingTask("H", dateToFormatEvening)).toEqual("19");
    });

    test("it should return zero-padded hour in 12-hr format", () => {
      expect(unitTestingTask("hh", dateToFormatMorning)).toEqual("09");
      expect(unitTestingTask("hh", dateToFormatEvening)).toEqual("07");
    });

    test("it should return hour in 12-hr format", () => {
      expect(unitTestingTask("h", dateToFormatMorning)).toEqual("9");
      expect(unitTestingTask("h", dateToFormatEvening)).toEqual("7");
    });

    test("it should return zero-padded minutes", () => {
      expect(unitTestingTask("mm", dateToFormatMorning)).toEqual("09");
      expect(unitTestingTask("mm", dateToFormatEvening)).toEqual("19");
    });

    test("it should return minutes", () => {
      expect(unitTestingTask("m", dateToFormatMorning)).toEqual("9");
      expect(unitTestingTask("m", dateToFormatEvening)).toEqual("19");
    });

    test("it should return zero-padded seconds", () => {
      expect(unitTestingTask("ss", dateToFormatMorning)).toEqual("09");
      expect(unitTestingTask("ss", dateToFormatEvening)).toEqual("19");
    });

    test("it should return seconds", () => {
      expect(unitTestingTask("s", dateToFormatMorning)).toEqual("9");
      expect(unitTestingTask("s", dateToFormatEvening)).toEqual("19");
    });

    test("it should return zero-padded milliseconds", () => {
      expect(unitTestingTask("ff", dateToFormatMorning)).toEqual("012");
      expect(unitTestingTask("ff", dateToFormatEvening)).toEqual("123");
    });

    test("it should return milliseconds", () => {
      expect(unitTestingTask("f", dateToFormatMorning)).toEqual("12");
      expect(unitTestingTask("f", dateToFormatEvening)).toEqual("123");
    });

    test("it should return AM in uppercase", () => {
      expect(unitTestingTask("A", dateToFormatMorning)).toEqual("AM");
    });

    test("it should return am in lowercase", () => {
      expect(unitTestingTask("a", dateToFormatMorning)).toEqual("am");
    });

    test("it should return PM in uppercase", () => {
      expect(unitTestingTask("A", dateToFormatEvening)).toEqual("PM");
    });

    test("it should return pm in lowercase", () => {
      expect(unitTestingTask("a", dateToFormatEvening)).toEqual("pm");
    });

    test("it should return timezone in ISO8601-compatible basic format", () => {
      expect(unitTestingTask("ZZ", dateToFormatMorning)).toEqual("+0200");
    });

    test("it should return timezone in ISO8601-compatible extended format", () => {
      expect(unitTestingTask("Z", dateToFormatMorning)).toEqual("+02:00");
    });
  });

  describe("adding new language", () => {
    beforeEach(() => {
      unitTestingTask._languages.current = "en";
    });

    test("it should add Belarusian language with options", () => {
      unitTestingTask.lang("belarusian", belarusianLang);

      expect(unitTestingTask._languages.belarusian).toBeTruthy();
      expect(unitTestingTask._languages.current).toEqual("belarusian");
    });

    test("it should import new language without options if this file exists", () => {
      unitTestingTask.lang("kk");

      expect(unitTestingTask._languages.kk).toBeTruthy();
      expect(unitTestingTask._languages.current).toEqual("kk");
    });

    test("it should stay current language as previous if a new language imports without options and this file does not exist", () => {
      unitTestingTask.lang("fr");

      expect(unitTestingTask._languages.fr).toBeUndefined();
      expect(unitTestingTask._languages.current).toEqual("en");
    });

    test("it should assign language to current if it has been declared", () => {
      unitTestingTask.lang("ru");
      unitTestingTask.lang("be");
      unitTestingTask.lang("ru");

      expect(unitTestingTask._languages.current).toEqual("ru");
    });
  });

  describe("format date according to Belarusian language", () => {
    beforeAll(() => {
      unitTestingTask.lang("be");
    });
    test("it should format date", () => {
      expect(
        Object.keys(unitTestingTask._languages).includes("be")
      ).toBeTruthy();
      expect(
        unitTestingTask(
          "YYYY-MMMM(MMM)-DDD HH:mm:ss:ff ZZ",
          dateToFormatMorning
        )
      ).toEqual("2022-жнівень(жні)-панядзелак 09:09:09:012 +0200");
    });

    test("it should format date relate to meridiem: night", () => {
      expect(unitTestingTask("A", dateToFormatNight)).toEqual("ночы");
    });

    test("it should format date relate to meridiem: morning", () => {
      expect(unitTestingTask("A", dateToFormatMorning)).toEqual("раніцы");
    });

    test("it should format date relate to meridiem: afternoon", () => {
      expect(unitTestingTask("A", dateToFormatAfternoon)).toEqual("дня");
    });

    test("it should format date relate to meridiem: evening", () => {
      expect(unitTestingTask("A", dateToFormatEvening)).toEqual("вечара");
    });
  });

  describe("format date according to Czech language", () => {
    beforeAll(() => {
      unitTestingTask.lang("cs");
    });
    test("it should format date", () => {
      expect(
        Object.keys(unitTestingTask._languages).includes("cs")
      ).toBeTruthy();
      expect(
        unitTestingTask(
          "YYYY-MMMM(MMM)-DDD HH:mm:ss:ff ZZ",
          dateToFormatMorning
        )
      ).toEqual("2022-září(srp)-pondělí 09:09:09:012 +0200");
    });

    test("it should format date relate to meridiem: morning", () => {
      expect(unitTestingTask("A", dateToFormatMorning)).toEqual("dopoledne");
    });

    test("it should format date relate to meridiem: evening", () => {
      expect(unitTestingTask("A", dateToFormatEvening)).toEqual("odpoledne");
    });
  });

  describe("format date according to Kazakh language", () => {
    beforeAll(() => {
      unitTestingTask.lang("kk");
    });
    test("it should format date", () => {
      expect(
        Object.keys(unitTestingTask._languages).includes("kk")
      ).toBeTruthy();
      expect(
        unitTestingTask(
          "YYYY-MMMM(MMM)-DDD HH:mm:ss:ff ZZ",
          dateToFormatMorning
        )
      ).toEqual("2022-тамыз(там)-дүйсенбі 09:09:09:012 +0200");
    });
  });

  describe("format date according to Polish language", () => {
    beforeAll(() => {
      unitTestingTask.lang("pl");
    });
    test("it should format date", () => {
      expect(
        Object.keys(unitTestingTask._languages).includes("pl")
      ).toBeTruthy();
      expect(
        unitTestingTask(
          "YYYY-MMMM(MMM)-DDD HH:mm:ss:ff ZZ",
          dateToFormatMorning
        )
      ).toEqual("2022-sierpeń(sie)-poniedziałek 09:09:09:012 +0200");
    });

    test("it should format date relate to meridiem: morning", () => {
      expect(unitTestingTask("A", dateToFormatMorning)).toEqual("rano");
    });

    test("it should format date relate to meridiem: evening", () => {
      expect(unitTestingTask("A", dateToFormatEvening)).toEqual("");
    });
  });

  describe("format date according to Russian language", () => {
    beforeAll(() => {
      unitTestingTask.lang("ru");
    });
    test("it should format date", () => {
      expect(
        Object.keys(unitTestingTask._languages).includes("ru")
      ).toBeTruthy();
      expect(
        unitTestingTask(
          "YYYY-MMMM(MMM)-DDD HH:mm:ss:ff ZZ",
          dateToFormatMorning
        )
      ).toEqual("2022-август(авг)-понедельник 09:09:09:012 +0200");
    });

    test("it should format date relate to meridiem: night", () => {
      expect(unitTestingTask("A", dateToFormatNight)).toEqual("ночи");
    });

    test("it should format date relate to meridiem: morning", () => {
      expect(unitTestingTask("A", dateToFormatMorning)).toEqual("утра");
    });

    test("it should format date relate to meridiem: afternoon", () => {
      expect(unitTestingTask("A", dateToFormatAfternoon)).toEqual("дня");
    });

    test("it should format date relate to meridiem: evening", () => {
      expect(unitTestingTask("A", dateToFormatEvening)).toEqual("вечера");
    });
  });

  describe("format date according to Turkish language", () => {
    beforeAll(() => {
      unitTestingTask.lang("tr");
    });
    test("it should format date", () => {
      expect(
        Object.keys(unitTestingTask._languages).includes("tr")
      ).toBeTruthy();
      expect(
        unitTestingTask(
          "YYYY-MMMM(MMM)-DDD HH:mm:ss:ff ZZ",
          dateToFormatMorning
        )
      ).toEqual("2022-Ağustos(Ağu)-Pazartesi 09:09:09:012 +0200");
    });
  });

  describe("format date according to Ukrainian language", () => {
    beforeAll(() => {
      unitTestingTask.lang("uk");
    });
    test("it should format date", () => {
      expect(
        Object.keys(unitTestingTask._languages).includes("uk")
      ).toBeTruthy();
      expect(
        unitTestingTask(
          "YYYY-MMMM(MMM)-DDD HH:mm:ss:ff ZZ",
          dateToFormatMorning
        )
      ).toEqual("2022-серпень(серп)-понеділок 09:09:09:012 +0200");
    });

    test("it should format date relate to meridiem: night", () => {
      expect(unitTestingTask("A", dateToFormatNight)).toEqual("ночі");
    });

    test("it should format date relate to meridiem: morning", () => {
      expect(unitTestingTask("A", dateToFormatMorning)).toEqual("ранку");
    });

    test("it should format date relate to meridiem: afternoon", () => {
      expect(unitTestingTask("A", dateToFormatAfternoon)).toEqual("дня");
    });

    test("it should format date relate to meridiem: evening", () => {
      expect(unitTestingTask("A", dateToFormatEvening)).toEqual("вечора");
    });
  });
});
