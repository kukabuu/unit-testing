const unitTestingTask = require("../unitTestingTask");

// * a lack of coverage (can be checked by opening /coverage/index.html)
// * failing tests when a different time zone is set on your computer.
// * Try to use one "expect" per test.
// * Test naming is usually an area to improve.
//
// Here you can find good naming examples using the "should" convention.
// https://github.com/mawrkus/js-unit-testing-guide
// You can also find "Given/When/Then" namings on your projects and if so you should be consistent with test names.
// https://markus.oberlehner.net/blog/naming-your-unit-tests-it-should-vs-given-when-then/

describe("unitTestingTask()", () => {
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
    function(hour) {
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

  it("should return formatted date when format and date were provided", () => {
    expect(unitTestingTask(format, dateToFormatMorning)).toBe(formattedDate);
  });

  describe("when format was not provided", () => {
    it("should throw an error", () => {
      expect(() => unitTestingTask(_, dateToFormatMorning)).toThrow(Error);
    });
  });

  describe("when a new formatting function was registered", () => {
    it("should return formatted date according to new format", () => {
      unitTestingTask.register("longDate", "d MMMM");
      expect(unitTestingTask("longDate", dateToFormatMorning)).toEqual(
        "15 August"
      );
    });
  });

  describe("when provided format was not in the tokens list", () => {
    it("should return provided 'format' string", () => {
      expect(unitTestingTask("WWWW", dateToFormatMorning)).toEqual("WWWW");
    });
  });

  describe("when format was provided", () => {
    it("should return last 2 digit of year", () => {
      expect(unitTestingTask("YY", dateToFormatMorning)).toEqual("22");
    });

    it("should return short name of month", () => {
      expect(unitTestingTask("MMM", dateToFormatMorning)).toEqual("Aug");
    });

    it("should return number of month in year without zero-padding", () => {
      expect(unitTestingTask("M", dateToFormatMorning)).toEqual("8");
    });

    it("should return full name of day", () => {
      expect(unitTestingTask("DDD", dateToFormatMorning)).toEqual("Monday");
    });

    it("should return short name of day", () => {
      expect(unitTestingTask("DD", dateToFormatMorning)).toEqual("Mon");
    });

    it("should return min name of day", () => {
      expect(unitTestingTask("D", dateToFormatMorning)).toEqual("Mo");
    });

    it("should return zero-padded hour in 24-hr format", () => {
      expect(unitTestingTask("HH", dateToFormatMorning)).toEqual("09");
      expect(unitTestingTask("HH", dateToFormatEvening)).toEqual("19");
    });

    it("should return hour in 24-hr format", () => {
      expect(unitTestingTask("H", dateToFormatMorning)).toEqual("9");
      expect(unitTestingTask("H", dateToFormatEvening)).toEqual("19");
    });

    it("should return zero-padded hour in 12-hr format", () => {
      expect(unitTestingTask("hh", dateToFormatMorning)).toEqual("09");
      expect(unitTestingTask("hh", dateToFormatEvening)).toEqual("07");
    });

    it("should return hour in 12-hr format", () => {
      expect(unitTestingTask("h", dateToFormatMorning)).toEqual("9");
      expect(unitTestingTask("h", dateToFormatEvening)).toEqual("7");
    });

    it("should return zero-padded minutes", () => {
      expect(unitTestingTask("mm", dateToFormatMorning)).toEqual("09");
      expect(unitTestingTask("mm", dateToFormatEvening)).toEqual("19");
    });

    it("should return minutes", () => {
      expect(unitTestingTask("m", dateToFormatMorning)).toEqual("9");
      expect(unitTestingTask("m", dateToFormatEvening)).toEqual("19");
    });

    it("should return zero-padded seconds", () => {
      expect(unitTestingTask("ss", dateToFormatMorning)).toEqual("09");
      expect(unitTestingTask("ss", dateToFormatEvening)).toEqual("19");
    });

    it("should return seconds", () => {
      expect(unitTestingTask("s", dateToFormatMorning)).toEqual("9");
      expect(unitTestingTask("s", dateToFormatEvening)).toEqual("19");
    });

    it("should return zero-padded milliseconds", () => {
      expect(unitTestingTask("ff", dateToFormatMorning)).toEqual("012");
      expect(unitTestingTask("ff", dateToFormatEvening)).toEqual("123");
    });

    it("should return milliseconds", () => {
      expect(unitTestingTask("f", dateToFormatMorning)).toEqual("12");
      expect(unitTestingTask("f", dateToFormatEvening)).toEqual("123");
    });

    it("should return AM in uppercase", () => {
      expect(unitTestingTask("A", dateToFormatMorning)).toEqual("AM");
    });

    it("should return am in lowercase", () => {
      expect(unitTestingTask("a", dateToFormatMorning)).toEqual("am");
    });

    it("should return PM in uppercase", () => {
      expect(unitTestingTask("A", dateToFormatEvening)).toEqual("PM");
    });

    it("should return pm in lowercase", () => {
      expect(unitTestingTask("a", dateToFormatEvening)).toEqual("pm");
    });

    it("should return timezone in ISO8601-compatible basic format", () => {
      expect(unitTestingTask("ZZ", dateToFormatMorning)).toEqual("+0200");
    });

    it("should return timezone in ISO8601-compatible extended format", () => {
      expect(unitTestingTask("Z", dateToFormatMorning)).toEqual("+02:00");
    });
  });

  describe("when provided date is a string", () => {
    it("should return formatted date", () => {});
  });

  describe("when provided date is a number", () => {
    it("should return formatted date", () => {});
  });

  describe("when provided date is a Date object", () => {
    it("should return formatted date", () => {});
  });

  describe("when date is not provided", () => {
    it("should return current formatted date", () => {});
  });

  describe("when date is a plain object", () => {
    it("should throw an error", () => {
      expect(() => unitTestingTask(format, {})).toThrow(Error);
    });
  });

  describe("unitTestingTask.lang()", () => {
    beforeEach(() => {
      unitTestingTask._languages.current = "en";
    });

    describe("when new language was provided with options", () => {
      it("should add new language", () => {
        unitTestingTask.lang("belarusian", belarusianLang);

        expect(unitTestingTask._languages.belarusian).toBeTruthy();
        expect(unitTestingTask._languages.current).toEqual("belarusian");
      });
    });

    describe("when new language was provided without options", () => {
      describe("when a file with new language has already existed", () => {
        it("should import language from the file", () => {
          unitTestingTask.lang("kk");

          expect(unitTestingTask._languages.current).toEqual("kk");
        });

        it("should change current language to the new language", () => {
          unitTestingTask.lang("kk");

          expect(unitTestingTask._languages.kk).toBeTruthy();
        });

        it("should assign language to current if it has been declared", () => {
          unitTestingTask.lang("ru");
          unitTestingTask.lang("be");
          unitTestingTask.lang("ru");

          expect(unitTestingTask._languages.current).toEqual("ru");
        });
      });

      describe("when a file with new language did not exist", () => {
        it("should stay current language as previous", () => {
          unitTestingTask.lang("fr");

          expect(unitTestingTask._languages.current).toEqual("en");
        });

        it("should not add a new language to the list", () => {
          unitTestingTask.lang("fr");
          expect(unitTestingTask._languages.fr).toBeUndefined();
        });
      });
    });
  });

  describe("when Belarusian language was provided", () => {
    beforeAll(() => {
      unitTestingTask.lang("be");
    });
    it("should return date", () => {
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

    describe("when format contains meridiem", () => {
      it("should return date relate to night", () => {
        expect(unitTestingTask("A", dateToFormatNight)).toEqual("ночы");
      });

      it("should return date relate to morning", () => {
        expect(unitTestingTask("A", dateToFormatMorning)).toEqual("раніцы");
      });

      it("should return date relate to afternoon", () => {
        expect(unitTestingTask("A", dateToFormatAfternoon)).toEqual("дня");
      });

      it("should return date relate to evening", () => {
        expect(unitTestingTask("A", dateToFormatEvening)).toEqual("вечара");
      });
    });
  });
  ``;

  describe("when Czech language was provided", () => {
    beforeAll(() => {
      unitTestingTask.lang("cs");
    });
    it("should return date", () => {
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

    describe("when format contains meridiem", () => {
      it("should return date relate to morning", () => {
        expect(unitTestingTask("A", dateToFormatMorning)).toEqual("dopoledne");
      });

      it("should return date relate to evening", () => {
        expect(unitTestingTask("A", dateToFormatEvening)).toEqual("odpoledne");
      });
    });
  });

  describe("format date according to Kazakh language", () => {
    beforeAll(() => {
      unitTestingTask.lang("kk");
    });
    it("should return date", () => {
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

  describe("when Polish language was provided", () => {
    beforeAll(() => {
      unitTestingTask.lang("pl");
    });
    it("should return date", () => {
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

    describe("when format contains meridiem", () => {
      it("should return date relate to morning", () => {
        expect(unitTestingTask("A", dateToFormatMorning)).toEqual("rano");
      });

      it("should return date relate to evening", () => {
        expect(unitTestingTask("A", dateToFormatEvening)).toEqual("");
      });
    });
  });

  describe("when Russian language was provided", () => {
    beforeAll(() => {
      unitTestingTask.lang("ru");
    });
    it("should return date", () => {
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

    describe("when format contains meridiem", () => {
      it("should return date relate to night", () => {
        expect(unitTestingTask("A", dateToFormatNight)).toEqual("ночи");
      });

      it("should return date relate to morning", () => {
        expect(unitTestingTask("A", dateToFormatMorning)).toEqual("утра");
      });

      it("should return date relate to afternoon", () => {
        expect(unitTestingTask("A", dateToFormatAfternoon)).toEqual("дня");
      });

      it("should return date relate to evening", () => {
        expect(unitTestingTask("A", dateToFormatEvening)).toEqual("вечера");
      });
    });
  });

  describe("when Turkish language was provided", () => {
    beforeAll(() => {
      unitTestingTask.lang("tr");
    });
    it("should return date", () => {
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

  describe("when Ukrainian language was provided", () => {
    beforeAll(() => {
      unitTestingTask.lang("uk");
    });
    it("should return date", () => {
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

    describe("when format contains meridiem", () => {
      it("should return date relate to night", () => {
        expect(unitTestingTask("A", dateToFormatNight)).toEqual("ночі");
      });

      it("should return date relate to morning", () => {
        expect(unitTestingTask("A", dateToFormatMorning)).toEqual("ранку");
      });

      it("should return date relate to afternoon", () => {
        expect(unitTestingTask("A", dateToFormatAfternoon)).toEqual("дня");
      });

      it("should return date relate to evening", () => {
        expect(unitTestingTask("A", dateToFormatEvening)).toEqual("вечора");
      });
    });
  });
});
