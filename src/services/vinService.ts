import { get } from "../utils/https"

const invalidChars = new RegExp(/i|o|q|I|O|Q/, "g")

export const filter = (vin: string) => {
    return vin
        .replace(invalidChars, "")
        .toUpperCase()
        .substr(0, 17)
}

export const validate = (_vin: string): string => {
    if (_vin && _vin.length == 17) {
        return null
    }

    return "17 chars expected"
}

export const convert = (_res: VinCheckResponse): CarInfo => {
    const carInfo: any = {}

    _res.Results.forEach(info => {
        carInfo[info.Variable] = info.Value
    })

    return carInfo
}

export const apiCheck = async (_vin: string): Promise<CarInfo> => {
    const decoded: any = await get(
        "https://vindecoder.p.mashape.com/decode_vin",
        { vin: _vin },
        "vSeqSi8RDfmshstFIuLrYpa9H85fp1AGW8Kjsnp62BMLza55WD"
    )

    if (decoded && decoded.specification) {
        return convert({
            Results: [
                {
                    Value: decoded.specification.make,
                    ValueId: null,
                    Variable: "make",
                    VariableId: null
                },
                {
                    Value: decoded.specification.year,
                    ValueId: null,
                    Variable: "year",
                    VariableId: null
                },
                {
                    Value: decoded.specification.trim_level,
                    ValueId: null,
                    Variable: "model",
                    VariableId: null
                }
            ]
        })
    }

    return null
}
