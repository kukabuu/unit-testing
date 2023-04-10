const timezonedDate = require("timezoned-date");

// Here you can find good naming examples using the "should" convention.
// https://github.com/mawrkus/js-unit-testing-guide
// https://markus.oberlehner.net/blog/naming-your-unit-tests-it-should-vs-given-when-then/

describe("unitTestingTask()", () => {
  const dateToFormatNight = "Mon Aug 15 2022 02:09:09:012 GMT+0000";
  const dateToFormatMorning = "Mon Aug 15 2022 09:09:09:012 GMT+0000";
  const dateToFormatAfternoon = "Mon Aug 15 2022 14:09:09:012 GMT+0000";
  const dateToFormatEvening = "Mon Aug 15 2022 19:19:19:123 GMT+0000";
  const formattedDate = "2022-08-15";
  const format = "YYYY-MM-dd";
  let unitTestingTask;

  beforeEach(() => {
    Date = timezonedDate.makeConstructor(0);
    unitTestingTask = require("../unitTestingTask");
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("should return formatted date when format and date were provided", () => {
    expect(unitTestingTask(format, dateToFormatMorning)).toBe(formattedDate);
  });

  describe("when format was not provided", () => {
    it("should throw an error", () => {
      expect(() => unitTestingTask(null, dateToFormatMorning)).toThrow(Error);
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

  describe("when date is a plain object", () => {
    it("should throw an error", () => {
      expect(() => unitTestingTask(format, {})).toThrow(Error);
    });
  });

  describe("unitTestingTask.formatters", () => {
    it("should return a list of availiable formaters", () => {
      const formatName = "ISO_Date";
      const format = "YYYY-MM-dd";

      unitTestingTask.register(formatName, format);

      const formatters = unitTestingTask.formatters();

      expect(formatters).toContain(formatName);
    });
  });

  describe.each`
    token     | date                   | expected
    ${"YYYY"} | ${dateToFormatMorning} | ${"2022"}
    ${"YY"}   | ${dateToFormatMorning} | ${"22"}
    ${"MMMM"} | ${dateToFormatMorning} | ${"August"}
    ${"MMM"}  | ${dateToFormatMorning} | ${"Aug"}
    ${"MM"}   | ${dateToFormatMorning} | ${"08"}
    ${"M"}    | ${dateToFormatMorning} | ${"8"}
    ${"DDD"}  | ${dateToFormatMorning} | ${"Monday"}
    ${"DD"}   | ${dateToFormatMorning} | ${"Mon"}
    ${"D"}    | ${dateToFormatMorning} | ${"Mo"}
    ${"dd"}   | ${dateToFormatMorning} | ${"15"}
    ${"d"}    | ${dateToFormatMorning} | ${"15"}
    ${"HH"}   | ${dateToFormatMorning} | ${"09"}
    ${"HH"}   | ${dateToFormatEvening} | ${"19"}
    ${"H"}    | ${dateToFormatMorning} | ${"9"}
    ${"H"}    | ${dateToFormatEvening} | ${"19"}
    ${"hh"}   | ${dateToFormatMorning} | ${"09"}
    ${"hh"}   | ${dateToFormatEvening} | ${"07"}
    ${"h"}    | ${dateToFormatMorning} | ${"9"}
    ${"h"}    | ${dateToFormatEvening} | ${"7"}
    ${"mm"}   | ${dateToFormatMorning} | ${"09"}
    ${"mm"}   | ${dateToFormatEvening} | ${"19"}
    ${"m"}    | ${dateToFormatMorning} | ${"9"}
    ${"m"}    | ${dateToFormatEvening} | ${"19"}
    ${"ss"}   | ${dateToFormatMorning} | ${"09"}
    ${"ss"}   | ${dateToFormatEvening} | ${"19"}
    ${"s"}    | ${dateToFormatMorning} | ${"9"}
    ${"s"}    | ${dateToFormatEvening} | ${"19"}
    ${"ff"}   | ${dateToFormatMorning} | ${"012"}
    ${"ff"}   | ${dateToFormatEvening} | ${"123"}
    ${"f"}    | ${dateToFormatMorning} | ${"12"}
    ${"f"}    | ${dateToFormatEvening} | ${"123"}
    ${"A"}    | ${dateToFormatMorning} | ${"AM"}
    ${"A"}    | ${dateToFormatEvening} | ${"PM"}
    ${"a"}    | ${dateToFormatMorning} | ${"am"}
    ${"a"}    | ${dateToFormatEvening} | ${"pm"}
    ${"ZZ"}   | ${dateToFormatMorning} | ${"+0000"}
    ${"Z"}    | ${dateToFormatMorning} | ${"+00:00"}
  `("when format was provided", ({ token, expected, date }) => {
    it(`returns ${expected} when format string is ${token} and date is '${date}'`, () => {
      expect(unitTestingTask(token, date)).toBe(expected);
    });
  });

  describe("unitTestingTask.lang()", () => {
    beforeEach(() => {
      unitTestingTask.lang("en");
    });

    describe("when new language was provided with options", () => {
      it("should add new language", () => {
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
            var nounCase = /dd?\s*MMMM?/.test(format)
              ? "accusative"
              : "nominative";
            return this._months[nounCase][date.getMonth()];
          },
          _monthsShort: "сту_лют_сак_кра_тра_чэр_ліп_жні_вер_кас_лис_сне".split(
            "_"
          ),
          monthsShort: function (date) {
            return this._monthsShort[date.getMonth()];
          },
          weekdays:
            "нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split(
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

        unitTestingTask.lang("belarusian", belarusianLang);

        expect(unitTestingTask.lang()).toEqual("belarusian");
      });
    });

    describe("when new language was provided without options", () => {
      describe("when a file with new language has already existed", () => {
        it("should assign language to current if it has been declared", () => {
          unitTestingTask.lang("ru");
          unitTestingTask.lang("be");
          unitTestingTask.lang("ru");

          expect(unitTestingTask.lang()).toEqual("ru");
        });
      });

      describe("when a file with new language did not exist", () => {
        it("should stay current language as previous", () => {
          unitTestingTask.lang("fake");

          expect(unitTestingTask.lang()).toEqual("en");
        });
      });
    });
  });

  describe.each`
    language        | languageCode | night          | morning        | afternoon      | evening        | formattedDate
    ${"Belarusian"} | ${"be"}      | ${"ночы"}      | ${"раніцы"}    | ${"дня"}       | ${"вечара"}    | ${"2022-жнівень(жні)-панядзелак 09:09:09:012 +0000"}
    ${"Czech"}      | ${"cs"}      | ${"dopoledne"} | ${"dopoledne"} | ${"odpoledne"} | ${"odpoledne"} | ${"2022-září(srp)-pondělí 09:09:09:012 +0000"}
    ${"Kazakh"}     | ${"kk"}      | ${""}          | ${""}          | ${""}          | ${""}          | ${"2022-тамыз(там)-дүйсенбі 09:09:09:012 +0000"}
    ${"Polish"}     | ${"pl"}      | ${"rano"}      | ${"rano"}      | ${""}          | ${""}          | ${"2022-sierpeń(sie)-poniedziałek 09:09:09:012 +0000"}
    ${"Russian"}    | ${"ru"}      | ${"ночи"}      | ${"утра"}      | ${"дня"}       | ${"вечера"}    | ${"2022-август(авг)-понедельник 09:09:09:012 +0000"}
    ${"Turkish"}    | ${"tr"}      | ${""}          | ${""}          | ${""}          | ${""}          | ${"2022-Ağustos(Ağu)-Pazartesi 09:09:09:012 +0000"}
    ${"Ukrainian"}  | ${"uk"}      | ${"ночі"}      | ${"ранку"}     | ${"дня"}       | ${"вечора"}    | ${"2022-серпень(серп)-понеділок 09:09:09:012 +0000"}
  `(
    "when language was provided",
    ({
      language,
      languageCode,
      night,
      morning,
      afternoon,
      evening,
      formattedDate,
    }) => {
      describe(`${language}:`, () => {
        beforeEach(() => {
          unitTestingTask.lang(languageCode);
        });

        it("should return formatted date", () => {
          expect(
            unitTestingTask(
              "YYYY-MMMM(MMM)-DDD HH:mm:ss:ff ZZ",
              dateToFormatMorning
            )
          ).toEqual(formattedDate);
        });
      });
    }
  );

  describe.each`
    language        | languageCode | night          | morning        | afternoon      | evening        | formattedDate
    ${"Belarusian"} | ${"be"}      | ${"ночы"}      | ${"раніцы"}    | ${"дня"}       | ${"вечара"}    | ${"2022-жнівень(жні)-панядзелак 09:09:09:012 +0000"}
    ${"Czech"}      | ${"cs"}      | ${"dopoledne"} | ${"dopoledne"} | ${"odpoledne"} | ${"odpoledne"} | ${"2022-září(srp)-pondělí 09:09:09:012 +0000"}
    ${"Polish"}     | ${"pl"}      | ${"rano"}      | ${"rano"}      | ${""}          | ${""}          | ${"2022-sierpeń(sie)-poniedziałek 09:09:09:012 +0000"}
    ${"Russian"}    | ${"ru"}      | ${"ночи"}      | ${"утра"}      | ${"дня"}       | ${"вечера"}    | ${"2022-август(авг)-понедельник 09:09:09:012 +0000"}
    ${"Ukrainian"}  | ${"uk"}      | ${"ночі"}      | ${"ранку"}     | ${"дня"}       | ${"вечора"}    | ${"2022-серпень(серп)-понеділок 09:09:09:012 +0000"}
  `(
    "when language was provided with meridiem",
    ({ language, languageCode, night, morning, afternoon, evening }) => {
      describe(`${language}:`, () => {
        beforeEach(() => {
          unitTestingTask.lang(languageCode);
        });

        it("should return date relate to the night", () => {
          expect(unitTestingTask("A", dateToFormatNight)).toEqual(night);
        });

        it("should return date relate to the morning", () => {
          expect(unitTestingTask("A", dateToFormatMorning)).toEqual(morning);
        });

        it("should return date relate to the afternoon", () => {
          expect(unitTestingTask("A", dateToFormatAfternoon)).toEqual(
            afternoon
          );
        });

        it("should return date relate to the evening", () => {
          expect(unitTestingTask("A", dateToFormatEvening)).toEqual(evening);
        });
      });
    }
  );
});
