import { convert, filter } from "./vinService"
import { vinCheckResponseFixture, vinResultEntryFixture } from "../test/fixtures"

describe("Vin Service", () => {
    describe.skip("Response converter", () => {
        it("gives empty result when no data is given", () => expect(convert(null)).toEqual(null))
        it("gives empty result when invalid data is given", () => expect(convert({} as any)).toEqual(null))
        it("gives empty result when response contains no data", () =>
            expect(convert(vinCheckResponseFixture({ Results: [] }))).toEqual(null))

        const entry = (Variable: string, Value: string) => vinResultEntryFixture({ Variable, Value })

        it("takes make from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Make", "HONDA")] })).make).toEqual("HONDA"))

        it("takes year from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Model Year", "2007")] })).year).toEqual(2007))

        it("takes type from Results array", () =>
            expect(
                convert(vinCheckResponseFixture({ Results: [entry("Vehicle Type", "PASSENGER CAR")] })).vechicleType
            ).toEqual("PASSENGER CAR"))

        it("takes trim from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Trim", "FN2")] })).trim).toEqual("FN2"))

        it("takes all values from Results", () =>
            expect(
                convert(
                    vinCheckResponseFixture({
                        Results: [
                            entry("Make", "MAZDA"),
                            entry("Model Year", "2010"),
                            entry("Model", "rx8"),
                            entry("Vehicle Type", "CAR"),
                            entry("Trim", "RX8")
                        ]
                    })
                )
            ).toEqual({
                make: "MAZDA",
                year: 2010,
                model: "rx8",
                vechicleType: "CAR",
                trim: "RX8"
            }))
    })

    describe("Darwin:Response converter", () => {
        it("should return empty object", () => {
            expect(convert({ Results: [] })).toEqual({})
        })

        it("should return Joaquim from make property", () => {
            expect(
                convert({ Results: [{ Value: "Joaquim", ValueId: null, Variable: "make", VariableId: null }] }).make
            ).toEqual("Joaquim")
        })

        it("should return Race from vechicleType property", () => {
            expect(
                convert({ Results: [{ Value: "Race", ValueId: null, Variable: "vechicleType", VariableId: null }] })
                    .vechicleType
            ).toEqual("Race")
        })

        it("should return an CarInfo object", () => {
            expect(
                convert({
                    Results: [
                        {
                            Value: "Ford",
                            ValueId: null,
                            Variable: "make",
                            VariableId: null
                        },
                        {
                            Value: "KA",
                            ValueId: null,
                            Variable: "model",
                            VariableId: null
                        },
                        {
                            Value: "2018",
                            ValueId: null,
                            Variable: "year",
                            VariableId: null
                        },
                        {
                            Value: "LX",
                            ValueId: null,
                            Variable: "trim",
                            VariableId: null
                        },
                        {
                            Value: "SUV",
                            ValueId: null,
                            Variable: "vechicleType",
                            VariableId: null
                        }
                    ]
                })
            ).toEqual({
                make: "Ford",
                model: "KA",
                year: "2018",
                trim: "LX",
                vechicleType: "SUV"
            })
        })
    })

    describe("Vin string filter", () => {
        it("uppercases given string", () => expect(filter("abc")).toEqual("ABC"))
        it("disallows IOQ", () => expect(filter("IOQabc")).toEqual("ABC"))
        it("disallows ioq", () => expect(filter("ioqabc")).toEqual("ABC"))
        it("trims to first 17 chars", () => expect(filter("SHHFN23607U002758abc")).toEqual("SHHFN23607U002758"))
    })
})
