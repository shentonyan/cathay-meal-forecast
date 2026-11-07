# Academic Literature Review: Airline Meal Demand Forecasting, Meal Choice and Inflight Food Waste

> Research notes behind the [report](../../docs/research.html), one per research track. Hover over any source link to see the supporting quote from that source.

## Background and scale of the problem

- IATA estimates that passenger flights generate about 6 million tonnes of waste a year. About 20% of it is untouched food and drink, worth roughly US$4 billion [Simple Flying](https://simpleflying.com/airlines-4-billion-untouched-food-drink/ "Some 20% of this is untouched food and drink, which the association estimates to carry a value of $4 billion.")
- According to IATA's Cabin Waste Handbook, global cabin waste was 5.7 million tonnes in 2017, and uneaten meals and drinks made up about 20% of it [DGLR 2025](https://www.dglr.de/publikationen/2025/650481.pdf "5.7 million tons of cabin waste were generated worldwide in 2017, with uneaten meals and beverages accounting about 20% of this.")
- Loading fewer meals also cuts weight and fuel burn: Southwest Airlines reports saving 33 million gallons of fuel by reducing on-board weight [DGLR 2025](https://www.dglr.de/publikationen/2025/650481.pdf "Southwest Airlines reports saving 33 million gallons of fuel through on-board weight reduction.")

## Subgoals 1 and 2: key papers

### 1. Aghazadeh (2025), "Machine learning-based inflight food waste prediction for sustainable aviation", Journal of Aviation and Space Studies (DergiPark)
- **Author and venue:** Duygu Aghazadeh, University of Turkish Aeronautical Association; J. Aviat. Space Stud. 5(1), 2025 [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "Machine learning-based inflight food waste prediction for sustainable aviation Duygu Aghazadeh")
- **Data:** a synthetic dataset of 10,000 records and 15 features. The author notes that no public inflight waste dataset exists [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "The models are trained using a synthetically created dataset of 10,000 records and 15 features, which include factors such as meal type, waste weight, and passenger number.")
- **Method:** multiple linear regression (MLR) and random forest regression (RFR), with engineered features such as Waste per Passenger and Meal Efficiency. The conclusion is that RFR fits complex patterns better [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "models can effectively forecast inflight food waste, with RFR being more adaptable to complicated patterns.")
- **Limitations:** no real data, and the abstract gives no directly comparable result such as kilograms saved.
- A food-service benchmark cited in the paper's review (Rodrigues et al., 2024): ML demand forecasting cut wasted meals by 14% to 52% and unmet demand by 3% to 16% [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "can result in a 14% to 52% reduction in the number of wasted meals and a 3% to 16% reduction in unmet demand when compared to baseline model projections.")

### 2. Kumawat, Giertzsch & God (2025), "Prediction of On-Board Consumption: Generating Synthetic Data for ML to Optimize Catering Weight", German Aerospace Congress DGLR 2025 (Hamburg University of Technology)
- **Problem:** real on-board consumption data is practically non-existent in the industry [DGLR 2025](https://www.dglr.de/publikationen/2025/650481.pdf "Real world catering on the consumption are practically non-existent and represent a major challenge for the development of machine learning (ML) -based predictive models")
- **Data:** simulated daily long-haul flights for 2015–2019 on FRA→DEL (Vistara B787-9) and FRA→JFK (Lufthansa B747-400), producing 413,574 and 435,274 passenger-level samples respectively [DGLR 2025](https://www.dglr.de/publikationen/2025/650481.pdf "For the FRA to DEL passenger-specific dataset, 413,574 data samples with a size of 44,633 Kilobyte (KB) were generated.")
- **Features:** gender, age, nationality, cabin class, meal and drink choices, departure and arrival times, plus aggregated flight-level features [DGLR 2025](https://www.dglr.de/publikationen/2025/650481.pdf "passenger-level features such as gender, age, flight details, nationality, meal and beverage choices, and aggregated journey-level features including total passenger count, gender and age group distribution, nationality profile, class distribution")
- **Nationality-driven preferences:** for example, about 24% of Indians are vegetarian, compared with about 4% of Americans [DGLR 2025](https://www.dglr.de/publikationen/2025/650481.pdf "approximately 24% of Indian are vegetarians, influencing veg meal preferences. On the other side, the research by Gallup [9] suggests that only 4% of Americans are vegetarian")
- **Conclusion:** synthetic data can support good catering-demand predictions that avoid over-loading; validation on real data is still needed [DGLR 2025](https://www.dglr.de/publikationen/2025/650481.pdf "this study shows that a good prediction of catering demand that avoids overstocking of meals and beverages can be achieved.")
- The paper also cites IATA's view that meal pre-selection and real-time inventory management help reduce over-loading [DGLR 2025](https://www.dglr.de/publikationen/2025/650481.pdf "a study from the IATA emphasizes the potential of pre-selection of In-flight meals and real-time in-ventory management in minimizing meals and beverage overload")

### 3. Aşıroğlu & Olca (2025), "SkyServe AI – Data-Driven Solution to Optimize Airline Food Loading Processes", IJONFEST 3(2)
- **Data:** real flight data for about 180,000 flights; features include route, passenger count, flight duration and total demand [DergiPark IJONFEST](https://dergipark.org.tr/en/download/article-file/5021241 "The data set taken to train the model includes detailed information about approximately 180,000 flights.")
- **Motivation:** traditional methods do not adequately account for seasonality or passenger profiles [DergiPark IJONFEST](https://dergipark.org.tr/en/download/article-file/5021241 "traditional methods do not sufficiently take into account dynamic factors such as seasonal changes and passenger profiles")
- **Result:** the authors only describe the model as having a "general prediction ability" and report no strong accuracy figures, which is itself a gap [DergiPark IJONFEST](https://dergipark.org.tr/en/download/article-file/5021241 "The accuracy rate of the developed model shows that the model has a general prediction ability according to the initial findings.")

### 4. You, Bhamra & Lilley (2020), "Why Is Airline Food Always Dreadful? Analysis of Factors Influencing Passengers' Food Wasting Behaviour", Sustainability 12(20):8571
- **Citation** [MDPI](https://www.mdpi.com/2071-1050/12/20/8571/notes "You, Fangzhou, Tracy Bhamra, and Debra Lilley. 2020. Why Is Airline Food Always Dreadful? Analysis of Factors Influencing Passengers' Food Wasting Behaviour, Sustainability 12, no. 20: 8571.")
- **Method and findings:** a qualitative study of passenger behaviour that identifies four groups of factors (normative, habitual, intentional and situational) and suggests interventions based on social norms [MDPI](https://www.mdpi.com/2071-1050/12/20/8571/html "Four types of factors were found to influence onboard passenger waste, these were normative, habitual, intentional and situational factors.")
- **Implication for this project:** whether a meal matches taste and preference affects leftovers, so loading the right *number* is not enough; the right *dishes* also matter.

### 5. Operations research: MDP and stochastic multi-objective models
- **Goto et al. (Cornell), "Coffee, Tea, or…? A Markov Decision Process Model for Airline Meal Provisioning":** a finite-horizon Markov decision process (MDP) for setting and revising meal upload quantities, with Air Canada as the case study [ResearchGate](https://www.researchgate.net/publication/2407094_Coffee_Tea_or_A_Markov_Decision_Process_Model_for_Airline_Meal_Provisioning "This paper develops and analyzes a finite horizon Markov decision process model for the airline meal provisioning activity focusing explicitly on developing policies for determining and revising the number of meals to upload.")
- **van der Walt & Bean (2022):** a stochastic, multi-objective inventory model that handles meal substitution and demand uncertainty, balancing waste reduction against the risk of running out [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "The authors develop a stochastic and multi-objective decision-making model that seeks to discover the most efficient combination of meals to order for a certain trip")
- **Teoh & Inderjit Singh:** a bi-objective optimisation model that considers passenger expectations alongside cost [ResearchGate](https://www.researchgate.net/figure/The-weight-of-respective-inflight-meal-18_tbl1_329188219 "proposed a bi-objective optimization model that aims to minimize total in-flight food waste by determining the optimal quantity of in-flight meals.")

### 6. Other relevant studies
- **Hast (2019):** compares several ML algorithms for forecasting inflight meal demand and identifies the relevant data elements (cited in Aghazadeh 2025) [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "(Hast, 2019) compares machine learning algorithms (MLAs) for forecasting consumer demand for inflight meals and identifies relevant data elements for this prediction.")
- **Megodawickrama (2017):** using data from a Sri Lankan caterer serving 14 international airlines, finds that load-factor swings in the 24 hours before departure drive up kitchen waste; recommends a robust forecasting system and a "meal bank" [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "demand uncertainty has a substantial impact on waste rise in the production area.")
- **Blanca-Alcubilla et al. (2019), LIFE+ Zero Cabin Waste project:** analyses 145 flights split by flight duration and cabin class, sorting waste into 20 categories; recommends removing unpopular items from menus [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "They evaluate 145 airplanes, separated by flight time and passenger class, and categorized and described the waste into 20 distinct elements.")
- **Tofalli et al. (2018):** suggests letting passengers choose at booking whether to reserve a meal, to reduce waste [DergiPark](https://dergipark.org.tr/en/download/article-file/4159755 "giving passengers the choice of reserving or not booking their meals when booking their flights might help to decrease food waste and losses.")
- **Ernits et al. (2022), Aerospace (BIBA, University of Bremen, with Airbus):** proposes an automation concept that lets every passenger receive a pre-ordered meal in flight [MDPI Aerospace](https://www.mdpi.com/2226-4310/9/11/736/pdf?version=1669171985 "Individualisation of Inflight Catering Meals—An Automation Concept for Integrating Pre-Ordered Meals during the Flight for All Passengers")
- **MDPI Sustainability (2023):** studies passengers' willingness to pre-order meals online and notes that research on reducing cabin waste is limited [MDPI](https://www.mdpi.com/2071-1050/15/10/8071/pdf?version=1684218959 "there is not enough research that explores its gravity in airlines and ways to reduce its total amount.")
- **Liman (2014), MIT master's thesis:** demand forecasting for inflight food sales on low-cost carriers [MIT DSpace](https://dspace.mit.edu/bitstream/handle/1721.1/102056/2014_1_Liman.pdf;sequence=1 "Inflight food sales have become an important revenue source for low cost airlines where demand forecasting is play a critical role in profitability.")

## Subgoal 3: most predictive features and gaps in the literature

**Features that recur across the literature**
1. **Passenger count and load factor, including changes close to departure:** Megodawickrama identifies these as the main driver of kitchen waste; SkyServe and Aghazadeh both use passenger count as a core input.
2. **Route and passenger nationality mix:** these drive the vegetarian share and drink preferences (DGLR 2025).
3. **Flight duration and cabin class:** Blanca-Alcubilla stratifies waste by both; SkyServe uses flight duration as a core variable.
4. **Meal type and menu popularity:** features such as Waste per Passenger and Meal Efficiency (Aghazadeh); removing unpopular dishes (LIFE+ project).
5. **Season and departure time, plus passenger age and gender:** used in the DGLR synthetic data; SkyServe notes that traditional methods ignore seasonality.

**Gaps in the literature (the opportunity for this project)**
- **Lack of real data:** Aghazadeh and DGLR use synthetic data only; SkyServe uses real data but reports weak accuracy. Cathay's real load and return data is a clear advantage.
- **Almost no public flight-level results** on kilograms or percentage of waste reduced; the main quantitative benchmark comes from general food service (14–52% fewer wasted meals).
- **The "forecast + pre-order" loop is unstudied:** pre-ordering research (Tofalli, Ernits, IATA) and forecasting research (ML studies) have developed separately. No study feeds pre-order signals into the model as features and then sets load quantities with a newsvendor or multi-objective optimisation.
- **No dish-level discrete choice models:** most studies forecast totals, not individual dish shares.
- **Behavioural factors** (social norms, taste) have not been quantified as model features.
- **Asian hubs and multicultural routes (such as Hong Kong) have not been studied.**

## Summary
- The academic evidence is fragmented: two 2025 ML papers (random forest, synthetic data), one paper on about 180,000 real flights (with modest results), operations-research models (MDP, stochastic multi-objective), and behavioural research (You et al., 2020).
- The literature agrees the key features are passenger count and load factor (and their changes), route and nationality, flight duration, cabin class, meal type, and season and time of day.
- This project adds three things the literature lacks: Cathay's real data; pre-order signals combined with ML forecasting; and newsvendor-style load optimisation on top of the forecast, with dish-level choice shares.
- Quantitative targets can reference the food-service benchmark (14–52% fewer wasted meals), while respecting a constraint on unmet demand (passengers who miss their meal).
