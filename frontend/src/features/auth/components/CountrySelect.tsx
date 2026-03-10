import { useEffect, useState } from "react"

interface Props{
    country: string,
    setCountry: React.Dispatch<React.SetStateAction<string>>
}

interface RESTCountry{
    // RESTCountry API shape
    cca2: string,
    name: {
        common: string,
    }
}

type RESTCountryResponse = RESTCountry[];

function CountrySelect({ country, setCountry }:Props){
    const [countryList, setCountryList ] = useState<RESTCountryResponse>([]);

    useEffect(()=>{
        const getData = async ()=>{
            try{
                const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
                if(!res.ok) throw new Error("Can't fetch country list.");
                const data: RESTCountryResponse = await res.json();

                const newList = data.sort((a, b) => 
                    a.name.common.localeCompare(b.name.common)
                );
                setCountryList(newList);
            }catch(e:unknown){
                console.log(e instanceof Error ? e.message : "Error fetch country list");
            }
        }

        getData();
    },[]);

    return (
        <div className="form-row">
            <select name="country" value={country} onChange={(e)=>setCountry(e.target.value)}>
                {
                    countryList.map((c)=>{
                        return <option key={c.cca2} value={c.cca2}>
                            {c.name.common}
                        </option>
                    })
                }
            </select>
        </div>
    )
}

export default CountrySelect