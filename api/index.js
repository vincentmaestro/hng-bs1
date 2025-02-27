import express from 'express';

const app = express();

const port = process.env.PORT || 3000;
const apiKey = 'Go1REba8PTrB2grCNy9AgnQ1IGeNr8ws';

app.listen(port, () => console.log(`app started on port ${port}`));
app.use(express.json());

app.get('/', (req, res) => res.send('From backend track HNG Stage 1: HI!'));

app.get('/api/hello', async (req, res) => {
    const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];

    const requestCity = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${apiKey}&q=${ip}`);
    const city = await requestCity.json();
    const cityKey = city.Key;
    const cityName = city.EnglishName;


    const requestWeather = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${apiKey}`);
    const weather = await requestWeather.json();
    const temperature = weather[0].Temperature;
    const temperatureInDegrees = temperature.Metric.Value;

    const visitor = {
        client_ip: ip,
        location: cityName,
        greeting: `Hello ${req.query.visitor_name}!, the temperature is ${temperatureInDegrees} degrees Celcius in ${cityName}`
    }

    res.send(visitor);
});

export default app;
