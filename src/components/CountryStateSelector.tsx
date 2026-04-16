'use client'

import { useState, useEffect } from 'react'
import { Country, State } from 'country-state-city'

interface CountryStateSelectorProps {
  selectedAreas: string[]
  onChange: (areas: string[]) => void
  error?: string
}

export default function CountryStateSelector({ selectedAreas, onChange, error }: CountryStateSelectorProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [availableStates, setAvailableStates] = useState<any[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [allStates, setAllStates] = useState<any[]>([])
  const [countrySearch, setCountrySearch] = useState('')
  const [stateSearch, setStateSearch] = useState('')

  // Load countries and states on mount
  useEffect(() => {
    try {
      const countriesData = Country.getAllCountries()
      setCountries(countriesData)
      
      const statesData = State.getAllStates()
      setAllStates(statesData)
    } catch (error) {
      console.error('Error loading country/state data:', error)
    }
  }, [])

  // Parse existing selected areas to populate countries and states
  useEffect(() => {
    const countries: string[] = []
    const states: string[] = []
    
    selectedAreas.forEach(area => {
      if (area.includes('-')) {
        // Format: "US-CA" (Country-State)
        const [country, state] = area.split('-')
        if (!countries.includes(country)) {
          countries.push(country)
        }
        states.push(area)
      } else {
        // Just a country code
        if (!countries.includes(area)) {
          countries.push(area)
        }
      }
    })
    
    setSelectedCountries(countries)
    setSelectedStates(states)
  }, [selectedAreas])

  // Update available states when countries change
  useEffect(() => {
    const states = allStates.filter((state: any) => selectedCountries.includes(state.countryCode))
    setAvailableStates(states)
  }, [selectedCountries, allStates])

  // Filter countries based on search
  const filteredCountries = countries.filter((country: any) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.isoCode.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const handleCountryToggle = (countryCode: string) => {
    const newCountries = selectedCountries.includes(countryCode)
      ? selectedCountries.filter(c => c !== countryCode)
      : [...selectedCountries, countryCode]

    setSelectedCountries(newCountries)

    // Remove all states from this country
    const newStates = selectedStates.filter(state => !state.startsWith(`${countryCode}-`))
    setSelectedStates(newStates)

    // Update selected areas
    const newAreas = [
      ...newCountries,
      ...newStates
    ]
    onChange(newAreas)
  }

  const handleStateToggle = (stateCode: string, countryCode: string) => {
    const fullStateCode = `${countryCode}-${stateCode}`
    const newStates = selectedStates.includes(fullStateCode)
      ? selectedStates.filter(s => s !== fullStateCode)
      : [...selectedStates, fullStateCode]

    setSelectedStates(newStates)

    // Update selected areas
    const newAreas = [
      ...selectedCountries,
      ...newStates
    ]
    onChange(newAreas)
  }

  const getCountryName = (code: string) => {
    return countries.find(c => c.isoCode === code)?.name || code
  }

  const getStateName = (code: string) => {
    return availableStates.find(s => s.isoCode === code)?.name || code
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Countries *
        </label>
        <input
          type="text"
          placeholder="Search countries..."
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
          className="w-full px-3 py-2 mb-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-800 rounded-lg">
          {filteredCountries.map(country => (
            <label key={country.isoCode} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
              <input
                type="checkbox"
                checked={selectedCountries.includes(country.isoCode)}
                onChange={() => handleCountryToggle(country.isoCode)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-300">{country.name}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedCountries.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select States/Regions (Optional)
          </label>
          <input
            type="text"
            placeholder="Search states..."
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            className="w-full px-3 py-2 mb-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <div className="space-y-4">
            {selectedCountries.map(countryCode => {
              const countryStates = availableStates.filter((state: any) => 
                state.countryCode === countryCode &&
                (state.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
                 state.isoCode.toLowerCase().includes(stateSearch.toLowerCase()))
              )
              if (countryStates.length === 0) return null

              return (
                <div key={countryCode} className="bg-gray-800 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    {getCountryName(countryCode)}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {countryStates.map(state => {
                      const fullStateCode = `${countryCode}-${state.isoCode}`
                      return (
                        <label key={state.isoCode} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedStates.includes(fullStateCode)}
                            onChange={() => handleStateToggle(state.isoCode, countryCode)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-xs text-gray-300">{state.name}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Areas Display */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Selected Service Areas
        </label>
        <div className="flex flex-wrap gap-2 p-3 bg-gray-800 rounded-lg min-h-[60px]">
          {selectedAreas.length === 0 ? (
            <span className="text-gray-500 text-sm">No areas selected</span>
          ) : (
            selectedAreas.map(area => {
              if (area.includes('-')) {
                const [country, state] = area.split('-')
                return (
                  <span key={area} className="bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded text-xs border border-emerald-600/30">
                    {getStateName(state)}, {getCountryName(country)}
                  </span>
                )
              } else {
                return (
                  <span key={area} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-600/30">
                    {getCountryName(area)} (All States)
                  </span>
                )
              }
            })
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}
