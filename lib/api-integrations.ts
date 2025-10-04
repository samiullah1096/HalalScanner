import axios from 'axios';

export interface ProductData {
  name: string;
  barcode?: string;
  brand?: string;
  ingredients: string[];
  categories: string[];
  imageUrl?: string;
  manufacturingCountry?: string;
  nutriments?: any;
}

export interface APIResult {
  source: string;
  success: boolean;
  data?: any;
  error?: string;
}

export interface QuranAyah {
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  transliteration?: string;
  relevance?: string;
}

export interface HadithData {
  book: string;
  number: number;
  text: string;
  chapter?: string;
}

export class APIIntegrator {
  private timeout = 8000;

  async fetchOpenFoodFacts(barcode: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        { timeout: this.timeout }
      );

      if (response.data.status === 1) {
        return {
          source: 'OpenFoodFacts',
          success: true,
          data: response.data.product
        };
      }
      return { source: 'OpenFoodFacts', success: false, error: 'Product not found' };
    } catch (error) {
      return { source: 'OpenFoodFacts', success: false, error: 'Connection failed' };
    }
  }

  async searchOpenFoodFactsByName(productName: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1&page_size=5`,
        { timeout: this.timeout }
      );

      if (response.data.products && response.data.products.length > 0) {
        return {
          source: 'OpenFoodFacts Search',
          success: true,
          data: response.data.products[0]
        };
      }
      return { source: 'OpenFoodFacts Search', success: false, error: 'No products found' };
    } catch (error) {
      return { source: 'OpenFoodFacts Search', success: false, error: 'Search failed' };
    }
  }

  async fetchFoodRepo(barcode: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://www.foodrepo.org/api/v3/products/${barcode}`,
        { timeout: this.timeout }
      );
      return { source: 'FoodRepo', success: true, data: response.data };
    } catch (error) {
      return { source: 'FoodRepo', success: false, error: 'Not available' };
    }
  }

  async fetchOpenProductData(barcode: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://product-open-data.com/api/v1/barcode/${barcode}`,
        { timeout: this.timeout }
      );
      return { source: 'OpenProductData', success: true, data: response.data };
    } catch (error) {
      return { source: 'OpenProductData', success: false, error: 'Not available' };
    }
  }

  async fetchRESTCountries(country: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`,
        { timeout: this.timeout }
      );
      return { source: 'REST Countries', success: true, data: response.data[0] };
    } catch (error) {
      return { source: 'REST Countries', success: false, error: 'Country not found' };
    }
  }

  async fetchGeoNames(country: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `http://api.geonames.org/searchJSON?country=${encodeURIComponent(country)}&maxRows=1&username=demo`,
        { timeout: this.timeout }
      );
      return { source: 'GeoNames', success: true, data: response.data };
    } catch (error) {
      return { source: 'GeoNames', success: false, error: 'Not available' };
    }
  }

  async fetchWorldBank(countryCode: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json`,
        { timeout: this.timeout }
      );
      return { source: 'World Bank', success: true, data: response.data };
    } catch (error) {
      return { source: 'World Bank', success: false, error: 'Not available' };
    }
  }

  async fetchWikipedia(brand: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(brand)}`,
        { timeout: this.timeout }
      );
      return { source: 'Wikipedia', success: true, data: response.data };
    } catch (error) {
      return { source: 'Wikipedia', success: false, error: 'Not found' };
    }
  }

  async fetchWikidata(brand: string): Promise<APIResult> {
    try {
      const query = `
        SELECT ?item ?itemLabel ?ownerLabel ?countryLabel WHERE {
          ?item rdfs:label "${brand}"@en.
          OPTIONAL { ?item wdt:P127 ?owner. }
          OPTIONAL { ?item wdt:P17 ?country. }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        } LIMIT 5
      `;

      const response = await axios.get(
        `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`,
        {
          timeout: this.timeout,
          headers: { 'Accept': 'application/json' }
        }
      );
      return { source: 'Wikidata', success: true, data: response.data };
    } catch (error) {
      return { source: 'Wikidata', success: false, error: 'Not available' };
    }
  }

  async fetchDBpedia(brand: string): Promise<APIResult> {
    try {
      const query = `
        SELECT * WHERE {
          ?subject rdfs:label "${brand}"@en.
          OPTIONAL { ?subject dbo:owner ?owner. }
          OPTIONAL { ?subject dbo:country ?country. }
        } LIMIT 5
      `;

      const response = await axios.get(
        `https://dbpedia.org/sparql?query=${encodeURIComponent(query)}&format=json`,
        {
          timeout: this.timeout,
          headers: { 'Accept': 'application/json' }
        }
      );
      return { source: 'DBpedia', success: true, data: response.data };
    } catch (error) {
      return { source: 'DBpedia', success: false, error: 'Not available' };
    }
  }

  async checkIsraelLinkage(brand: string): Promise<APIResult> {
    try {
      const query = `
        SELECT ?item ?itemLabel ?countryLabel WHERE {
          ?item rdfs:label "${brand}"@en.
          ?item wdt:P17 wd:Q801.
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        } LIMIT 5
      `;

      const response = await axios.get(
        `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`,
        {
          timeout: this.timeout,
          headers: { 'Accept': 'application/json' }
        }
      );

      const hasIsraelLink = response.data?.results?.bindings?.length > 0;

      return {
        source: 'Israel Linkage Check',
        success: true,
        data: { hasIsraelLink, details: response.data }
      };
    } catch (error) {
      return { source: 'Israel Linkage Check', success: false, error: 'Check failed' };
    }
  }

  async fetchOpenSanctions(entity: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://api.opensanctions.org/search/default?q=${encodeURIComponent(entity)}`,
        { timeout: this.timeout }
      );
      return { source: 'OpenSanctions', success: true, data: response.data };
    } catch (error) {
      return { source: 'OpenSanctions', success: false, error: 'Not available' };
    }
  }

  async fetchFDAEnforcement(query?: string): Promise<APIResult> {
    try {
      const url = query
        ? `https://api.fda.gov/food/enforcement.json?search=${encodeURIComponent(query)}&limit=5`
        : 'https://api.fda.gov/food/enforcement.json?limit=5';

      const response = await axios.get(url, { timeout: this.timeout });
      return { source: 'FDA Enforcement', success: true, data: response.data };
    } catch (error) {
      return { source: 'FDA Enforcement', success: false, error: 'Not available' };
    }
  }

  async fetchOpenFDA(query: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://api.fda.gov/food/event.json?search=${encodeURIComponent(query)}&limit=5`,
        { timeout: this.timeout }
      );
      return { source: 'OpenFDA', success: true, data: response.data };
    } catch (error) {
      return { source: 'OpenFDA', success: false, error: 'Not available' };
    }
  }

  async fetchUSDAFoods(query: string): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=5&api_key=DEMO_KEY`,
        { timeout: this.timeout }
      );
      return { source: 'USDA Foods', success: true, data: response.data };
    } catch (error) {
      return { source: 'USDA Foods', success: false, error: 'Not available' };
    }
  }

  async fetchFAOSTAT(): Promise<APIResult> {
    try {
      const response = await axios.get(
        'https://fenixservices.fao.org/faostat/api/v1/en/definitions/domain',
        { timeout: this.timeout }
      );
      return { source: 'FAOSTAT', success: true, data: response.data };
    } catch (error) {
      return { source: 'FAOSTAT', success: false, error: 'Not available' };
    }
  }

  async fetchAlternatives(category: string): Promise<APIResult> {
    try {
      const cleanCategory = category.split(',')[0].trim();
      const response = await axios.get(
        `https://world.openfoodfacts.org/category/${encodeURIComponent(cleanCategory)}.json?page_size=20`,
        { timeout: this.timeout }
      );
      return { source: 'Alternatives', success: true, data: response.data };
    } catch (error) {
      return { source: 'Alternatives', success: false, error: 'Not available' };
    }
  }

  async fetchQuranAlQuranCloud(surah: number, ayah: number): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/ar.alafasy,en.asad`,
        { timeout: this.timeout }
      );
      return { source: 'Quran (Al Quran Cloud)', success: true, data: response.data };
    } catch (error) {
      return { source: 'Quran (Al Quran Cloud)', success: false, error: 'Not available' };
    }
  }

  async fetchQuranPages(surah: number): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://quranapi.pages.dev/api/${surah}.json`,
        { timeout: this.timeout }
      );
      return { source: 'Quran (QuranAPI Pages)', success: true, data: response.data };
    } catch (error) {
      return { source: 'Quran (QuranAPI Pages)', success: false, error: 'Not available' };
    }
  }

  async fetchHadithFawaz(book: string, number: number): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${book}/${number}.json`,
        { timeout: this.timeout }
      );
      return { source: 'Hadith (Fawaz Ahmed)', success: true, data: response.data };
    } catch (error) {
      return { source: 'Hadith (Fawaz Ahmed)', success: false, error: 'Not available' };
    }
  }

  async fetchHadithArugaz(book: string, number: number): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://cdn.jsdelivr.net/gh/arugaz-api/hadith-api@z/editions/eng-${book}/hadiths/${number}.json`,
        { timeout: this.timeout }
      );
      return { source: 'Hadith (Arugaz)', success: true, data: response.data };
    } catch (error) {
      return { source: 'Hadith (Arugaz)', success: false, error: 'Not available' };
    }
  }

  async fetchHadithGading(book: string, number: number): Promise<APIResult> {
    try {
      const response = await axios.get(
        `https://api.hadith.gading.dev/books/${book}/${number}`,
        { timeout: this.timeout }
      );
      return { source: 'Hadith (Gadingnst)', success: true, data: response.data };
    } catch (error) {
      return { source: 'Hadith (Gadingnst)', success: false, error: 'Not available' };
    }
  }

  async fetchHalalCertBodies(): Promise<APIResult> {
    try {
      const query = `
        SELECT ?item ?itemLabel ?countryLabel WHERE {
          ?item wdt:P31 wd:Q891723.
          OPTIONAL { ?item wdt:P17 ?country. }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        } LIMIT 10
      `;

      const response = await axios.get(
        `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`,
        {
          timeout: this.timeout,
          headers: { 'Accept': 'application/json' }
        }
      );
      return { source: 'Halal Certification Bodies', success: true, data: response.data };
    } catch (error) {
      return { source: 'Halal Certification Bodies', success: false, error: 'Not available' };
    }
  }

  async fetchAllData(barcode: string, productName?: string): Promise<{
    product: ProductData | null;
    apiResults: APIResult[];
    successCount: number;
    quranEvidence: QuranAyah[];
    hadithEvidence: HadithData[];
  }> {
    const results: APIResult[] = [];
    const quranData: QuranAyah[] = [];
    const hadithData: HadithData[] = [];

    const isBarcode = /^\d+$/.test(barcode.trim());

    let productAPIs;
    if (isBarcode) {
      productAPIs = await Promise.allSettled([
        this.fetchOpenFoodFacts(barcode),
        this.fetchFoodRepo(barcode),
        this.fetchOpenProductData(barcode),
      ]);
    } else {
      productAPIs = await Promise.allSettled([
        this.searchOpenFoodFactsByName(barcode),
        this.fetchUSDAFoods(barcode),
      ]);
    }

    productAPIs.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });

    let productData: ProductData | null = null;

    for (const result of productAPIs) {
      if (result.status === 'fulfilled' && result.value.success && result.value.data) {
        const p = result.value.data;

        if (result.value.source.includes('OpenFoodFacts')) {
          productData = {
            name: p.product_name || productName || barcode,
            barcode: p.code || barcode,
            brand: p.brands,
            ingredients: p.ingredients_text?.split(',').map((i: string) => i.trim()).filter(Boolean) || [],
            categories: p.categories?.split(',').map((c: string) => c.trim()).filter(Boolean) || [],
            imageUrl: p.image_url,
            manufacturingCountry: p.manufacturing_places || p.countries,
            nutriments: p.nutriments
          };
          break;
        } else if (result.value.source === 'FoodRepo') {
          productData = {
            name: p.name || p.display_name || productName || barcode,
            barcode: p.barcode || barcode,
            brand: p.brand || p.manufacturer,
            ingredients: p.ingredients?.map((i: any) => typeof i === 'string' ? i : i.name).filter(Boolean) || [],
            categories: Array.isArray(p.categories) ? p.categories : [],
            imageUrl: p.images?.[0]?.url || p.image,
            manufacturingCountry: p.origin || p.country,
            nutriments: p.nutrients
          };
          break;
        } else if (result.value.source === 'OpenProductData') {
          productData = {
            name: p.name || p.product_name || productName || barcode,
            barcode: p.barcode || barcode,
            brand: p.brand || p.brands,
            ingredients: Array.isArray(p.ingredients) ? p.ingredients : (p.ingredients_text?.split(',').map((i: string) => i.trim()).filter(Boolean) || []),
            categories: Array.isArray(p.categories) ? p.categories : (p.categories?.split(',').map((c: string) => c.trim()).filter(Boolean) || []),
            imageUrl: p.image_url || p.image,
            manufacturingCountry: p.country || p.origin,
            nutriments: p.nutriments || p.nutrition
          };
          break;
        } else if (result.value.source === 'USDA Foods') {
          const food = p.foods?.[0] || p;
          productData = {
            name: food.description || productName || barcode,
            barcode: barcode,
            brand: food.brandOwner || food.brandName,
            ingredients: food.ingredients?.split(',').map((i: string) => i.trim()).filter(Boolean) || [],
            categories: [food.foodCategory || 'Food'].filter(Boolean),
            imageUrl: undefined,
            manufacturingCountry: undefined,
            nutriments: food.foodNutrients
          };
          break;
        }
      }
    }

    if (productData) {
      if (productData.brand) {
        const brandAPIs = await Promise.allSettled([
          this.fetchWikipedia(productData.brand),
          this.fetchWikidata(productData.brand),
          this.fetchDBpedia(productData.brand),
          this.checkIsraelLinkage(productData.brand),
          this.fetchOpenSanctions(productData.brand)
        ]);

        brandAPIs.forEach((result) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        });
      }

      if (productData.manufacturingCountry) {
        const countryAPIs = await Promise.allSettled([
          this.fetchRESTCountries(productData.manufacturingCountry),
          this.fetchGeoNames(productData.manufacturingCountry),
          this.fetchWorldBank(productData.manufacturingCountry.substring(0, 3).toUpperCase())
        ]);

        countryAPIs.forEach((result) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        });
      }

      if (productData.categories && productData.categories.length > 0) {
        const altResult = await this.fetchAlternatives(productData.categories[0]);
        results.push(altResult);
      }

      if (productData.name) {
        const fdaAPIs = await Promise.allSettled([
          this.fetchFDAEnforcement(productData.name),
          this.fetchOpenFDA(productData.name),
          this.fetchUSDAFoods(productData.name)
        ]);

        fdaAPIs.forEach((result) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        });
      }
    }

    const generalAPIs = await Promise.allSettled([
      this.fetchFAOSTAT(),
      this.fetchHalalCertBodies()
    ]);

    generalAPIs.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });

    const quranAPIs = await Promise.allSettled([
      this.fetchQuranAlQuranCloud(5, 90),
      this.fetchQuranAlQuranCloud(2, 173),
      this.fetchQuranAlQuranCloud(2, 168),
      this.fetchQuranPages(5)
    ]);

    quranAPIs.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);

        if (result.value.success && result.value.data) {
          if (index < 3 && result.value.data.data) {
            const ayahData = Array.isArray(result.value.data.data)
              ? result.value.data.data
              : [result.value.data.data];

            ayahData.forEach((ayah: any) => {
              if (ayah.text) {
                quranData.push({
                  surah: ayah.surah?.number || ayah.number?.split(':')[0] || 0,
                  ayah: ayah.numberInSurah || ayah.number?.split(':')[1] || 0,
                  arabic: ayah.edition?.identifier === 'ar.alafasy' ? ayah.text : '',
                  translation: ayah.edition?.identifier !== 'ar.alafasy' ? ayah.text : ''
                });
              }
            });
          }
        }
      }
    });

    const hadithAPIs = await Promise.allSettled([
      this.fetchHadithFawaz('muslim', 2003),
      this.fetchHadithFawaz('bukhari', 52),
      this.fetchHadithGading('muslim', 5),
      this.fetchHadithArugaz('muslim', 1001)
    ]);

    hadithAPIs.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);

        if (result.value.success && result.value.data) {
          const hadithInfo = result.value.data;
          if (hadithInfo.hadith || hadithInfo.text || hadithInfo.arab) {
            hadithData.push({
              book: hadithInfo.book || 'Unknown',
              number: hadithInfo.hadithNumber || hadithInfo.number || 0,
              text: hadithInfo.hadith || hadithInfo.text || hadithInfo.arab || '',
              chapter: hadithInfo.chapter
            });
          }
        }
      }
    });

    const successCount = results.filter(r => r.success).length;

    return {
      product: productData,
      apiResults: results,
      successCount,
      quranEvidence: quranData,
      hadithEvidence: hadithData
    };
  }
}
