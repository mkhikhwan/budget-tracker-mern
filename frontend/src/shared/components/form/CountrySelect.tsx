import { useEffect, useState } from "react"
import { getCountries, type Country } from "../../services/countryService"

interface Props {
    country: string,
    setCountry: React.Dispatch<React.SetStateAction<string>>
}

function CountrySelect({ country, setCountry }: Props) {
    const [countryList, setCountryList] = useState<Country[]>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const list = await getCountries();
                setCountryList(list);
            } catch (e: unknown) {
                console.log(e instanceof Error ? e.message : "Error fetch country list");
            }
        }

        getData();
    }, []);

    return (
        <div className="form-row">
            <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            >
                <option value="" disabled>Select Country</option>
                {
                    countryList.map((c) => {
                        return <option key={c.code} value={c.code}>
                            {c.name}
                        </option>
                    })
                }
            </select>
        </div>
    )
}

export default CountrySelect