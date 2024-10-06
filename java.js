import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js"; // Убедитесь, что путь верный
import getStarfield from "./getting-started-with-threejs-main/star/getStarfield.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();
// Get the audio element
const audio = document.getElementById('background-music');

// Ensure autoplay works even if blocked by the browser
audio.play().catch((error) => {
  console.log('Autoplay prevented:', error);
  // You can add logic here to inform the user or ask for interaction to start audio
});

// Optionally set the volume
audio.volume = 1;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enablePan = false;

const raycaster = new THREE.Raycaster();
const pointerPos = new THREE.Vector2();
const globeUV = new THREE.Vector2();
const textureLoader = new THREE.TextureLoader();
const starSprite = textureLoader.load("./getting-started-with-threejs-main/star/circle.png");
const colorMap = textureLoader.load('./getting-started-with-threejs-main/star/map16test.jpg');
const colorMap2 = textureLoader.load('./getting-started-with-threejs-main/star/eco1.png');
const elevMap = textureLoader.load('./getting-started-with-threejs-main/star/topobump.png');
const colorMap3 = textureLoader.load('./getting-started-with-threejs-main/star/urv1.png');
const colorMap4 = textureLoader.load('./getting-started-with-threejs-main/star/soc1.png');
const colorMap5 = textureLoader.load('./getting-started-with-threejs-main/star/obr2.png');



const textures = [colorMap, colorMap2, colorMap3, colorMap4, colorMap5];
let currentTextureIndex = 0;
// Создаем группу до добавления в нее объектов
const globeGroup = new THREE.Group();
scene.add(globeGroup);

const geo = new THREE.IcosahedronGeometry(1.0, 20);
const mat = new THREE.MeshBasicMaterial({
  color: 0x202020,
  transparent: true,
  opacity: 0.1
});
const globe = new THREE.Mesh(geo, mat);
globeGroup.add(globe);

const wireMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.01
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);
globe.add(wireMesh);

const pointsgeo = new THREE.IcosahedronGeometry(1.0, 180);
const vertexShader = `
  uniform sampler2D elevTexture;
  uniform float size;
  uniform vec2 mouseUV;
  varying vec2 vUv; 
    void main() {
      vUv = uv;  
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float elv = texture2D(elevTexture,vUv).r;
      mvPosition.z +=0.13*elv;
      float dist = distance(mouseUV, vUv);
      float zDisp = 0.0;
      if (dist<0.01){
      zDisp = (0.03-dist)*0.2;
      }
      mvPosition.z +=zDisp;
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
uniform sampler2D colorTexture;
varying vec2 vUv;
void main() {
    float alpha = 1.0;
    vec3 color = texture2D(colorTexture, vUv).rgb;
    gl_FragColor = vec4(color, alpha);
}
`;

const uniforms = {
  size: { value: 1.7 },
  colorTexture: { value: colorMap }, 
  elevTexture: { value: elevMap },
  mouseUV: {type: "v2", value: new THREE.Vector2(0.0,0.0)}, 
};

const pointsMat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true,
});

const points = new THREE.Points(pointsgeo, pointsMat);
globeGroup.add(points);

const HemiLight = new THREE.HemisphereLight(0xf75555, 0x000444);
scene.add(HemiLight);

const stars = getStarfield({ numStars: 500, sprite: starSprite });
scene.add(stars);

// Добавление кнопки для переключения текстур
const button = document.createElement('button');
button.innerText = 'Switch Texture';
button.style.position = 'absolute';
button.style.top = '825px';
button.style.left = '50px';
document.body.appendChild(button);

let currentTexture = 1;



/// окна в текстурах 



// Creating windows for each texture
const windowForTexture2 = document.createElement('div');
const windowForTexture3 = document.createElement('div');
const windowForTexture4 = document.createElement('div');
const windowForTexture5 = document.createElement('div');
const windowForTexture6 = document.createElement('div');
const windowForTexture7 = document.createElement('div');

// Basic styles for the windows
[windowForTexture2, windowForTexture3, windowForTexture4, windowForTexture5, windowForTexture6,windowForTexture7].forEach((window) => {
  window.style.position = 'absolute';
  window.style.right = '20px';
  window.style.top = '100px';
  window.style.padding = '10px';
  window.style.background = 'rgba(0, 0, 0, 0.5)';
  window.style.border = '2px solid rgba(7, 79, 134, 0.5)';
  window.style.borderRadius = '12px';
  window.style.color = 'white';
  window.style.display = 'none'; // Hidden initially
  document.body.appendChild(window);
});

// Adding content for the windows
const imageForTexture2 = document.createElement('img');
imageForTexture2.src = './foto/eco.png';;
imageForTexture2.style.width = '200px'; // Set fixed width
imageForTexture2.style.height = '150px'; // Set fixed height
imageForTexture2.style.height = 'auto';
windowForTexture2.appendChild(imageForTexture2);

const imageForTexture3 = document.createElement('img');
imageForTexture3.src = './foto/urv1.png';
imageForTexture3.style.width = '200px'; // Set fixed width
imageForTexture3.style.height = '150px'; // Set fixed height
imageForTexture3.style.height = 'auto';
windowForTexture3.appendChild(imageForTexture3);

const imageForTexture4 = document.createElement('img');
imageForTexture4.src = './foto/soc.png';
imageForTexture4.style.width = '200px'; // Set fixed width
imageForTexture4.style.height = '150px'; // Set fixed height
imageForTexture4.style.height = 'auto';
windowForTexture4.appendChild(imageForTexture4);

const imageForTexture5 = document.createElement('img');
imageForTexture5.src = './foto/ob1.png';
imageForTexture5.style.width = '200px'; // Set fixed width
imageForTexture5.style.height = '150px'; // Set fixed height
imageForTexture5.style.height = 'auto';
windowForTexture5.appendChild(imageForTexture5);


















/////---Окна регионов и подрегионов---/////


// Флаги видимости окон
let isRegionWindowVisible = true;
let isSubRegionWindowVisible = false;
let isThirdWindowVisible = false;

// Функция для переключения видимости первого окна при клике















// Список кнопок для каждого региона
const regionButtons = {
  'Eupore': ['Western Europe', 'Northern Europe', 'Southern Europe', 'Eastern Europe'],
  'Asia': ['Western Asia', 'Central Asia', 'Southern Asia', 'Northern Asia', 'Eastern Asia', 'Southeast Asia'],
  'Africa': ['Northern Africa', 'Western Africa', 'Central Africa', 'Eastern Africa', 'Southern Africa'],
  'America': ['North America', 'Central America', 'Caribbean', 'South America'],
  'Australia and Oceania': ['Australia and New Zealand', 'Melanesia', 'Micronesia', 'Polynesia']
};


// Информация о погоде для каждого региона
const weatherInfo = {
  'Central Asia': 'Clear, +18°C\nRecommendation: Enjoy the sunny day, but take an umbrella just in case.\nFood: Eat fresh fruits and vegetables to maintain energy.',
  'Eastern Asia': 'Cloudy, +20°C\nRecommendation: Bring a light jacket and an umbrella.\nFood: Drink warm tea to lift your mood.',
  'Southeast Asia': 'Rain, +25°C\nRecommendation: Don’t forget to take an umbrella and waterproof shoes.\nFood: Eat light meals and drink plenty of water.',
  'Northern Asia': 'Showers, +10°C to +20°C\nRecommendation: Lagman, beshbarmak.\nLight jacket, umbrella.',
  'Southern Asia': 'Partly cloudy, +28°C\nRecommendation: Drink plenty of water and wear light clothing.\nAvoid heavy food to not overburden your body.',
  'Western Asia': 'Clear, +22°C\nRecommendation: A great day for a walk, but take an umbrella just in case.\nEat light snacks and drink plenty of water.',
  'Northern Africa': 'Sunny, +30°C\nRecommendation: Drink lots of water and use sunscreen.\nAvoid caffeine and alcohol to prevent dehydration.',
  'Western Africa': 'Rain, +26°C\nRecommendation: Take an umbrella and be careful on the roads.\nEat warm soups for comfort and coziness.',
  'Central Africa': 'Cloudy, +24°C\nRecommendation: Light clothing and an umbrella will be useful.\nDrink herbal teas to relax.',
  'Eastern Africa': 'Partly cloudy, +23°C\nRecommendation: Perfect for walks, but take an umbrella just in case.\nEat fresh fruits to maintain energy.',
  'Southern Africa': 'Clear, +20°C\nRecommendation: Enjoy the clear weather, but take an umbrella just in case.\nDrink lots of water and eat light snacks.',
  'North America': 'Cloudy, +15°C\nRecommendation: Bring warm clothes and an umbrella.\nDrink hot chocolate to lift your mood.',
  'Central America': 'Rain, +27°C\nRecommendation: Don’t forget an umbrella and be careful on the roads.\nEat light meals and drink plenty of water.',
  'South America': 'Partly cloudy, +22°C\nRecommendation: A great day for outdoor activities.\nEat fresh fruits and vegetables to maintain energy.',
  'Caribbean': 'Rain, +28°C\nRecommendation: Take an umbrella and be careful on the roads.\nDrink plenty of water and avoid heavy food.',
  'Eastern Europe': 'Clear, +16°C\nRecommendation: Enjoy the clear weather, but take an umbrella just in case.\nDrink warm tea to lift your mood.',
  'Northern Europe': 'Cloudy, +12°C\nRecommendation: Bring warm clothes and an umbrella.\nEat warm soups for comfort and coziness.',
  'Southern Europe': 'Sunny, +24°C\nRecommendation: Drink plenty of water and use sunscreen.\nEat light snacks and drink plenty of water.',
  'Western Europe': 'Partly cloudy, +18°C\nRecommendation: A great day for outdoor walks.\nEat fresh fruits and vegetables to maintain energy.',
  'Australia and New Zealand': 'Clear, +22°C\nRecommendation: Enjoy the clear weather, but take an umbrella just in case.\nDrink lots of water and eat light snacks.',
  'Micronesia': 'Partly cloudy, rain, +30°C\nRecommendation: Light and waterproof clothing, umbrella.\nDishes made of coconut and taro, fish, and seafood.',
  'Polynesia': 'Sunny, +28°C\nRecommendation: Light clothing, shorts, t-shirts, hats.\nFresh seafood, tropical fruits.',
  'Melanesia': 'Cloudy with clearings, rain, +29°C\nRecommendation: Light clothing, light jacket or raincoat.\nDishes made of yam and sweet potatoes, vegetables.'
};


const cataclysmInfo = {
  'Eastern Asia': {
    'Earthquakes': 'Great East Japan Earthquake (2011) – A magnitude 9.0 earthquake that caused a tsunami and the Fukushima nuclear disaster.',
    'Typhoons': 'Typhoon Hagibis (2019) – A destructive typhoon in Japan that caused flooding and landslides.',
    'Floods': 'Yangtze River Floods in China (1998) – One of the largest floods, affecting 200 million people.'
  },
  'Southeast Asia': {
    'Cyclones': 'Cyclone Nargis (2008) – Struck Myanmar, causing 138,000 deaths.',
    'Floods': 'Floods in Thailand (2011) – Severe floods affecting over 13 million people.',
    'Volcanic Eruptions': 'Eruption of Mount Pinatubo (1991) – The second-largest eruption of the 20th century in the Philippines.'
  },
  'Southern Asia': {
    'Cyclones': 'Cyclone Amphan (2020) – A super cyclone that hit India and Bangladesh, causing destruction.',
    'Floods': 'South Asian Floods (2017) – Monsoon floods affecting 45 million people in Nepal, India, and Bangladesh.',
    'Droughts': 'Drought in India (2015-2016) – Severe water shortage in several states.'
  },
  'Central Asia': {
    'Earthquakes': 'Armenia Earthquake (1988) – A magnitude 6.8 earthquake causing over 25,000 deaths.',
    'Floods': 'Floods in Tajikistan (2015) – Heavy rains causing infrastructure damage.',
    'Droughts': 'Drought in Kazakhstan (2012) – Severe impact on agriculture.'
  },
  'Western Asia': {
    'Earthquakes': 'Bam Earthquake (2003) – A magnitude 6.6 earthquake in Iran causing over 26,000 deaths.',
    'Droughts': 'Drought in Syria (2006-2011) – Contributing to conflict and economic difficulties.',
    'Dust Storms': 'Dust Storm in the Middle East (2015) – A major storm affecting several countries.'
  },
  'Northern Asia': {
    'Earthquakes': 'Kuril Islands Earthquake (2006) – A magnitude 8.3 earthquake off the coast of Russia.',
    'Floods': 'Amur River Flood (2013) – Flooding in the Amur River region of Russia and China.',
    'Wildfires': 'Siberian Wildfires (2019) – Massive fires burning over 6 million hectares.'
  },
  'Northern Africa': {
    'Droughts': 'Drought in North Africa (1999-2002) – Affected Morocco, Algeria, and Tunisia.',
    'Floods': 'Floods in Morocco (2014) – Heavy rains causing floods and casualties.',
    'Dust Storms': 'Sahara Sandstorms – Seasonal storms affecting large areas.'
  },
  'Western Africa': {
    'Droughts': 'Sahel Drought (1968-1985) – Severe famine and agricultural losses.',
    'Floods': 'Floods in West Africa (2009) – Flooding affecting several countries.',
    'Dust Storms': 'Harmattan Winds – Regular seasonal dust storms.'
  },
  'Central Africa': {
    'Floods': 'Central Africa Floods (2019) – Heavy rains causing damage in several countries.',
    'Droughts': 'Drought in Angola (2019) – Drought affecting southern regions.'
  },
  'Eastern Africa': {
    'Droughts': 'Horn of Africa Drought (2011) – Severe famine and mass displacement.',
    'Floods': 'Floods in Kenya (2020) – Severe flooding across the country.',
    'Earthquakes': 'Earthquake in Tanzania (2016) – A magnitude 5.9 earthquake in northwest Tanzania.'
  },
  'Southern Africa': {
    'Droughts': 'Cape Town Drought (2015-2018) – Major water supply disruptions.',
    'Floods': 'Floods in Mozambique (2000) – Floods caused by a cyclone, causing significant damage.',
    'Cyclones': 'Cyclone Idai (2019) – Affected Mozambique, Zimbabwe, and Malawi.'
  },
  'North America': {
    'Hurricanes': 'Hurricane Katrina (2005) – One of the most destructive hurricanes in US history.',
    'Tornadoes': 'Joplin Tornado (2011) – An EF5 tornado causing major damage in Missouri.',
    'Floods': 'Mississippi River Floods (2011) – Extensive flooding along the Mississippi River.',
    'Wildfires': 'California Wildfires (2020) – A record-breaking wildfire season in the state.'
  },
  'Central America': {
    'Hurricanes': 'Hurricane Mitch (1998) – One of the most powerful hurricanes causing massive losses.',
    'Earthquakes': 'El Salvador Earthquake (2001) – A series of earthquakes causing significant damage.',
    'Floods': 'Floods in Honduras (2018) – Severe floods affecting thousands of people.'
  },
  'South America': {
    'Floods': 'Amazon Floods (2014) – One of the largest floods in recent decades in the Amazon Basin.',
    'Earthquakes': 'Chile Earthquake (2010) – A magnitude 8.8 earthquake causing widespread destruction.',
    'Droughts': 'Drought in Brazil (2014-2015) – Severe drought affecting water supply and agriculture.'
  },
  'Caribbean Basin': {
    'Hurricanes': 'Hurricane Maria (2017) – Devastated Puerto Rico and surrounding islands.',
    'Earthquakes': 'Haiti Earthquake (2010) – A catastrophic earthquake causing serious damage and losses.',
    'Floods': 'Caribbean Floods (2020) – Widespread flooding on several islands.'
  },
  'Western Europe': {
    'Floods': 'Floods in Europe (2002) – Severe floods in Germany, Austria, and neighboring countries.',
    'Storms': 'Storm Xaver (2013) – A powerful winter storm affecting the UK, Netherlands, and Germany.',
    'Wildfires': 'Wildfires in Portugal (2017) – Deadly fires across the country.'
  },
  'Eastern Europe': {
    'Floods': 'Central European Floods (2013) – Severe flooding across several countries.',
    'Earthquakes': 'Romania Earthquake (1977) – A magnitude 7.2 earthquake causing destruction.',
    'Wildfires': 'Wildfires in Ukraine (2020) – Extensive fires in the Chernobyl exclusion zone.'
  },
  'Northern Europe': {
    'Floods': 'Storm Ciara (2020) – Strong winds and flooding affecting the UK and Northern Europe.',
    'Storms': 'Storm Eleanor (2018) – Strong winds and weather disruptions across Northern Europe.'
  },
  'Southern Europe': {
    'Earthquakes': 'L\'Aquila Earthquake (2009) – A magnitude 6.3 earthquake affecting central Italy.',
    'Floods': 'Balkans Floods (2014) – Severe flooding affecting Serbia, Bosnia, and Croatia.',
    'Wildfires': 'Wildfires in Greece (2018) – Deadly fires near Athens.'
  },
  'Australia and New Zealand': {
    'Cyclones': 'Cyclone Yasi (2011) – One of the most powerful tropical cyclones in Australian history.',
    'Floods': 'Queensland Floods (2010-2011) – Widespread flooding in eastern Australia.',
    'Wildfires': 'Australia Wildfires (2019-2020) – Devastating fires across the country.'
  },
  'Melanesia': {
    'Cyclones': 'Cyclone Pam (2015) – Devastated Vanuatu with strong winds and flooding.',
    'Earthquakes': 'Solomon Islands Earthquake (2013) – A magnitude 8.0 earthquake causing a tsunami.',
    'Floods': 'Floods in Vanuatu (2014) – Heavy rains causing flooding.'
  },
  'Micronesia': {
    'Cyclones': 'Typhoon Maysak (2015) – Affected the Federated States of Micronesia causing destruction.',
    'Droughts': 'Drought in Micronesia (2016) – Prolonged drought affecting water supply.',
    'Floods': 'Floods on Pohnpei Island (2019) – Heavy rains causing localized flooding.'
  },
  'Polynesia': {
    'Cyclones': 'Cyclone Gita (2018) – Hit Tonga and Samoa, causing infrastructure damage.',
    'Tsunamis': 'Tsunami in Samoa (2009) – Caused by an undersea earthquake, leading to serious damage.',
    'Earthquakes': 'Tonga Earthquake (2021) – Significant seismic activity affecting regions.'
  }
};

// Gender features for each region
const genderFeatures = {
  'Northern Africa': {
    'Adaptation': '70% (women in agriculture)',
    'Gender-differentiated effects': '65% (climate-related diseases)',
    'Access to information and resources': '35% (access to information)',
    'Gender-based violence and safety': '55% (cases of violence)',
    'Consumer consumption and ecological footprint': '70% (use of public transport)',
    'Cultural and social barriers': '70% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Western Africa': {
    'Adaptation': '60% (women in agriculture)',
    'Gender-differentiated effects': '60% (climate-related diseases)',
    'Access to information and resources': '40% (access to information)',
    'Gender-based violence and safety': '50% (cases of violence)',
    'Consumer consumption and ecological footprint': '65% (use of public transport)',
    'Cultural and social barriers': '65% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '35% (participation in environmental initiatives)'
  },
  'Central Africa': {
    'Adaptation': '65% (women in agriculture)',
    'Gender-differentiated effects': '70% (climate-related diseases)',
    'Access to information and resources': '45% (access to information)',
    'Gender-based violence and safety': '60% (cases of violence)',
    'Consumer consumption and ecological footprint': '70% (use of public transport)',
    'Cultural and social barriers': '70% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '45% (participation in environmental initiatives)'
  },
  'Eastern Africa': {
    'Adaptation': '55% (women in agriculture)',
    'Gender-differentiated effects': '55% (climate-related diseases)',
    'Access to information and resources': '35% (access to information)',
    'Gender-based violence and safety': '50% (cases of violence)',
    'Consumer consumption and ecological footprint': '60% (use of public transport)',
    'Cultural and social barriers': '60% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Southern Africa': {
    'Adaptation': '60% (women in agriculture)',
    'Gender-differentiated effects': '60% (climate-related diseases)',
    'Access to information and resources': '40% (access to information)',
    'Gender-based violence and safety': '55% (cases of violence)',
    'Consumer consumption and ecological footprint': '65% (use of public transport)',
    'Cultural and social barriers': '65% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '50% (participation in environmental initiatives)'
  },
  'Central Asia': {
    'Adaptation': '50% (women in agriculture)',
    'Gender-differentiated effects': '50% (climate-related diseases)',
    'Access to information and resources': '30% (access to information)',
    'Gender-based violence and safety': '50% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '35% (participation in environmental initiatives)'
  },
  'Eastern Asia': {
    'Adaptation': '55% (women in agriculture)',
    'Gender-differentiated effects': '55% (food security)',
    'Access to information and resources': '35% (access to information)',
    'Gender-based violence and safety': '45% (cases of violence)',
    'Consumer consumption and ecological footprint': '60% (use of public transport)',
    'Cultural and social barriers': '60% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Southern Asia': {
    'Adaptation': '30% (access to information)',
    'Gender-differentiated effects': '50% (food security)',
    'Access to information and resources': '30% (access to information)',
    'Gender-based violence and safety': '45% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '60% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '35% (participation in environmental initiatives)'
  },
  'Southeast Asia': {
    'Adaptation': '50% (women in agriculture)',
    'Gender-differentiated effects': '50% (food security)',
    'Access to information and resources': '35% (access to information)',
    'Gender-based violence and safety': '45% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Eastern Europe': {
    'Adaptation': '45% (participation in climate actions)',
    'Gender-differentiated effects': '50% (health issues)',
    'Access to information and resources': '35% (access to information)',
    'Gender-based violence and safety': '45% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Northern Europe': {
    'Adaptation': '45% (participation in climate actions)',
    'Gender-differentiated effects': '50% (health issues)',
    'Access to information and resources': '45% (participation in climate actions)',
    'Gender-based violence and safety': '40% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '50% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '45% (participation in environmental initiatives)'
  },
  'Southern Europe': {
    'Adaptation': '50% (participation in climate actions)',
    'Gender-differentiated effects': '50% (health issues)',
    'Access to information and resources': '35% (access to information)',
    'Gender-based violence and safety': '45% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Western Europe': {
    'Adaptation': '50% (participation in climate actions)',
    'Gender-differentiated effects': '50% (health issues)',
    'Access to information and resources': '35% (access to information)',
    'Gender-based violence and safety': '45% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Caribbean Basin': {
    'Adaptation': '50% (participation in climate actions)',
    'Gender-differentiated effects': '50% (health issues)',
    'Access to information and resources': '35% (access to information)',
    'Gender-based violence and safety': '60% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Central America': {
    'Adaptation': '60% (participation in cooperatives)',
    'Gender-differentiated effects': '50% (access to resources)',
    'Access to information and resources': '60% (participation in cooperatives)',
    'Gender-based violence and safety': '55% (cases of violence)',
    'Consumer consumption and ecological footprint': '65% (use of public transport)',
    'Cultural and social barriers': '65% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '50% (participation in environmental initiatives)'
  },
  'South America': {
    'Adaptation': '60% (participation in cooperatives)',
    'Gender-differentiated effects': '60% (access to resources)',
    'Access to information and resources': '60% (participation in cooperatives)',
    'Gender-based violence and safety': '55% (cases of violence)',
    'Consumer consumption and ecological footprint': '65% (use of public transport)',
    'Cultural and social barriers': '65% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '50% (participation in environmental initiatives)'
  },
  'North America': {
    'Adaptation': '50% (participation in environmental organizations)',
    'Gender-differentiated effects': '60% (health issues)',
    'Access to information and resources': '50% (participation in environmental organizations)',
    'Gender-based violence and safety': '50% (cases of violence)',
    'Consumer consumption and ecological footprint': '50% (use of private transport)',
    'Cultural and social barriers': '50% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '45% (participation in environmental initiatives)'
  },
  'Australia and New Zealand': {
    'Adaptation': '40% (participation in climate actions)',
    'Gender-differentiated effects': '45% (health issues)',
    'Access to information and resources': '40% (participation in climate actions)',
    'Gender-based violence and safety': '45% (cases of violence)',
    'Consumer consumption and ecological footprint': '45% (use of private transport)',
    'Cultural and social barriers': '50% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '40% (participation in environmental initiatives)'
  },
  'Melanesia': {
    'Adaptation': '50% (participation in climate actions)',
    'Gender-differentiated effects': '50% (food security)',
    'Access to information and resources': '50% (participation in climate actions)',
    'Gender-based violence and safety': '55% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '50% (participation in environmental initiatives)'
  },
  'Micronesia': {
    'Adaptation': '50% (participation in climate actions)',
    'Gender-differentiated effects': '70% (food security)',
    'Access to information and resources': '50% (participation in climate actions)',
    'Gender-based violence and safety': '65% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '50% (participation in environmental initiatives)'
  },
  'Polynesia': {
    'Adaptation': '50% (participation in climate actions)',
    'Gender-differentiated effects': '70% (food security)',
    'Access to information and resources': '50% (participation in climate actions)',
    'Gender-based violence and safety': '65% (cases of violence)',
    'Consumer consumption and ecological footprint': '55% (use of public transport)',
    'Cultural and social barriers': '55% (cultural barriers)',
    'Women’s education and involvement in environmental initiatives': '50% (participation in environmental initiatives)'
  }
};
  
// Названия изображений для каждого региона
const regionImages = {
  'Central Asia': 'central_asia.png',
  'Eastern Asia': 'east_asia.jpg',
  'Western Asia': 'west_asia.png',
  'Southern Asia': 'south_asia.jpg',
  'Northern Asia': 'north_asia.jpg',
  'Southeast Asia': 'southeast_asia.jpg',
  'Western Europe': 'west_europe.png',
  'Northern Europe': 'north_europe.png',
  'Southern Europe': 'south_europe.png',
  'Eastern Europe': 'east_europe.png',
  'Northern Africa': 'north_africa.jpg',
  'Western Africa': 'west_africa.jpg',
  'Central Africa': 'central_africa.jpg',
  'Eastern Africa': 'east_africa.jpg',
  'Southern Africa': 'south_africa.jpg',
  'North America': 'north_america.jpg',
  'Central America': 'central_america.jpg',
  'Caribbean': 'caribbean.jpg',
  'South America': 'south_america.jpg',
  'Australia and New Zealand': 'australia_new_zealand.jpg',
  'Melanesia': 'melanesia.jpg',
  'Micronesia': 'micronesia.jpg',
  'Polynesia': 'polynesia.jpg'
};
const cataclysmImages = {
  'Earthquakes': 'earthquake.jpeg',
  'Typhoons': 'typhoon.jpeg',
  'Floods': 'flood.jpeg',
  'Cyclones': 'cyclone.jpeg',
  'Volcanic Eruptions': 'volcano.jpeg',
  'Droughts': 'drought.jpeg',
  'Dust Storms': 'duststorm.jpeg',
  'Wildfires': 'wildfire.jpeg',
  'Hurricanes': 'typhoon.jpeg',
  'Tornadoes': 'cyclone.jpeg',
  'Tsunamis': 'cyclone.jpeg'
};


// Путь к папке с изображениями
const imageFolderPath = './foto/'; // Проверьте путь к папке с изображениями


// Создаем кнопку "Закрыть"
const closeButton = document.createElement('button');
closeButton.innerText = 'Сlose';
closeButton.style.position = 'absolute';
closeButton.style.bottom = '20px';
closeButton.style.right = '20px';
closeButton.style.visibility = 'hidden';
closeButton.style.opacity = '0';
closeButton.style.transition = 'opacity 0.5s ease';
document.body.appendChild(closeButton);

// Создаем первое окно с регионами
const regionWindow = document.createElement('div');
regionWindow.style.position = 'absolute';
regionWindow.style.top = '50px';
regionWindow.style.left = '50px';
regionWindow.style.padding = '10px';
regionWindow.style.background = 'transparent';
regionWindow.style.border = '2px solid #074f86';
regionWindow.style.borderRadius = '12px';
regionWindow.style.display = 'flex';
regionWindow.style.flexDirection = 'column';
regionWindow.style.gap = '10px';
regionWindow.style.opacity = '1';
regionWindow.style.visibility = 'visible';
regionWindow.style.transition = 'opacity 0.5s ease';
document.body.appendChild(regionWindow);

const regions = ['Europe', 'Asia', 'Africa', 'America', 'Australia and Oceania'];
regions.forEach(region => {
  const button = document.createElement('button');
  button.innerText = region;
  button.style.marginBottom = '5px';
  regionWindow.appendChild(button);

  // Добавляем обработчик клика на кнопки первого окна
  button.addEventListener('click', () => {
    updateSubRegionButtons(region);
  });
});

// Создаем второе окно для подрегионов
const subRegionWindow = document.createElement('div');
subRegionWindow.style.position = 'absolute';
subRegionWindow.style.top = '50px';
subRegionWindow.style.left = '300px';
subRegionWindow.style.padding = '10px';
subRegionWindow.style.background = 'transparent';
subRegionWindow.style.border = '2px solid #074f86';
subRegionWindow.style.borderRadius = '12px';
subRegionWindow.style.display = 'flex';
subRegionWindow.style.flexDirection = 'column';
subRegionWindow.style.gap = '10px';
subRegionWindow.style.opacity = '0';
subRegionWindow.style.transition = 'opacity 0.5s ease';
subRegionWindow.style.visibility = 'hidden';
document.body.appendChild(subRegionWindow);

// Создаем третье окно для дополнительных опций
const thirdWindow = document.createElement('div');
thirdWindow.style.position = 'absolute';
thirdWindow.style.top = '50%';
thirdWindow.style.left = '50%';
thirdWindow.style.transform = 'translate(-50%, -50%)';
thirdWindow.style.padding = '10px';
thirdWindow.style.background = 'transparent';
thirdWindow.style.border = '2px solid #074f86';
thirdWindow.style.borderRadius = '12px';
thirdWindow.style.display = 'flex';
thirdWindow.style.flexDirection = 'column';
thirdWindow.style.gap = '10px';
thirdWindow.style.opacity = '0';
thirdWindow.style.transition = 'opacity 0.5s ease';
thirdWindow.style.visibility = 'hidden';
document.body.appendChild(thirdWindow);

// Четвертое окно
const fourthWindow = document.createElement('div');
fourthWindow.style.position = 'absolute';
fourthWindow.style.top = '50%';
fourthWindow.style.left = '50%';
fourthWindow.style.transform = 'translate(-50%, -50%)';
fourthWindow.style.padding = '10px';
fourthWindow.style.background = 'transparent';
fourthWindow.style.border = '2px solid #074f86';
fourthWindow.style.borderRadius = '12px';
fourthWindow.style.display = 'flex';
fourthWindow.style.flexDirection = 'column';
fourthWindow.style.gap = '10px';
fourthWindow.style.opacity = '0';
fourthWindow.style.transition = 'opacity 0.5s ease';
fourthWindow.style.visibility = 'hidden';
document.body.appendChild(fourthWindow);

// Функция для обновления кнопок второго окна в зависимости от выбранного региона
function updateSubRegionButtons(region) {
  subRegionWindow.innerHTML = '';

  regionButtons[region].forEach(subRegion => {
    const button = document.createElement('button');
    button.innerText = subRegion;
    button.style.marginBottom = '5px';
    subRegionWindow.appendChild(button);

    // Добавляем обработчик клика для открытия третьего окна
    button.addEventListener('click', () => {
      updateThirdWindowButtons(subRegion);
    });
  });

  isSubRegionWindowVisible = true;
  subRegionWindow.style.visibility = 'visible';
  subRegionWindow.style.opacity = '1';
  closeButton.style.visibility = 'visible';
  closeButton.style.opacity = '1';
}

// Функция для обновления кнопок третьего окна
// Function to display the third window buttons based on the selected region
function updateThirdWindowButtons(region) {
  thirdWindow.innerHTML = ''; // Clear the third window content

  // Array of options for the third window
  const thirdWindowButtons = ['Wheather', 'Cataclysms', 'Gender differences'];

  // Add buttons to the third window
  thirdWindowButtons.forEach(buttonText => {
    const button = document.createElement('button');
    button.innerText = buttonText;
    button.style.marginBottom = '5px';
    thirdWindow.appendChild(button);

    // Click handler for each button
    button.addEventListener('click', () => {
      if (buttonText === 'Wheather') {
        updateFourthWindow(region, 'weather');
      } else if (buttonText === 'Cataclysms') {
        updateFourthWindow(region, 'cataclysms');
      } else if (buttonText === 'Gender differences') {
        updateFourthWindow(region, 'gender');
      }
    });
  });

  thirdWindow.style.visibility = 'visible';
  thirdWindow.style.opacity = '1';
  regionWindow.style.visibility = 'hidden';
  subRegionWindow.style.visibility = 'hidden';
  closeButton.style.visibility = 'visible';
  closeButton.style.opacity = '1';
}

// Function to display the fourth window content based on type
// Function to display the fourth window content based on type
// Function to display the fourth window content based on type
// Function to display the fourth window content based on type
function updateFourthWindow(region, type) {
  fourthWindow.innerHTML = ''; // Clear the content of the fourth window

  // Set position based on window type
  if (type === 'weather') {
    // Position weather window on the left
    fourthWindow.style.top = '50px';
    fourthWindow.style.left = '50px';
    fourthWindow.style.transform = 'none'; // Remove centering
  } else if (type === 'gender') {
    // Position gender feature window in the top-left corner
    fourthWindow.style.top = '10px';
    fourthWindow.style.left = '10px';
    fourthWindow.style.transform = 'none'; // Remove centering
  } else {
    // Position cataclysms window in the center
    fourthWindow.style.top = '50%';
    fourthWindow.style.left = '50%';
    fourthWindow.style.transform = 'translate(-50%, -50%)'; // Center the window
  }

  if (type === 'cataclysms') {
    // Logic for displaying cataclysm information
    const cataclysms = cataclysmInfo[region];
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-around';
    container.style.alignItems = 'flex-start'; // Align items to the top
    container.style.gap = '10px';
    container.style.border = '2px solid space-around';
    container.style.padding = '10px';
    container.style.margin = '10px';
    container.style.borderRadius = '12px';

    Object.entries(cataclysms).forEach(([cataclysm, description]) => {
      const cataclysmDiv = document.createElement('div');
      cataclysmDiv.style.border = '2px solid #074f86';
      cataclysmDiv.style.margin = '10px';
      cataclysmDiv.style.padding = '10px';
      cataclysmDiv.style.width = '200px';
      cataclysmDiv.style.height = '400px'; // Set a fixed height for consistency
      cataclysmDiv.style.flexShrink = '0';

      const nameDiv = document.createElement('div');
      nameDiv.innerText = cataclysm;
      nameDiv.style.textAlign = 'center';
      nameDiv.style.fontWeight = 'bold';
      cataclysmDiv.appendChild(nameDiv);

      const descriptionDiv = document.createElement('div');
      descriptionDiv.innerText = description;
      descriptionDiv.style.marginTop = '10px';
      cataclysmDiv.appendChild(descriptionDiv);

      // Create an image element
      const img = document.createElement('img');
      // Use cataclysmImages mapping to find the correct image file
      const cataclysmImageName = cataclysmImages[cataclysm];
      if (cataclysmImageName) {
        img.src = `${imageFolderPath}${cataclysmImageName}`;
      } else {
        img.src = `${imageFolderPath}default.jpg`; // Fallback image if not found
      }
      img.style.width = '100%'; // Make sure the image fills the div width
      img.style.height = '200px'; // Set a fixed height for consistency
      img.style.marginTop = '10px';
      img.style.objectFit = 'cover'; // Maintain aspect ratio while covering the space
      cataclysmDiv.appendChild(img);

      container.appendChild(cataclysmDiv);
    });

    fourthWindow.appendChild(container);
  } else {
    // Logic for displaying weather or gender information
    let contentText = '';

    if (type === 'weather') {
      contentText = weatherInfo[region] || 'Информация о погоде отсутствует.';
    } else if (type === 'gender') {
      const genderData = genderFeatures[region];
      if (genderData) {
        contentText = Object.entries(genderData)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      } else {
        contentText = 'Информация о гендерных особенностях отсутствует.';
      }
    }

    const infoText = document.createElement('div');
    infoText.innerText = contentText;
    infoText.style.whiteSpace = 'pre-line';
    fourthWindow.appendChild(infoText);

    if (type === 'weather') {
      const img = document.createElement('img');
      img.src = `${imageFolderPath}${regionImages[region]}`;
      img.style.width = '100%';
      img.style.height = '300px';
      img.style.marginTop = '10px';
      img.style.objectFit = 'cover';
      fourthWindow.appendChild(img);
    }
  }

  fourthWindow.style.visibility = 'visible';
  fourthWindow.style.opacity = '1';
  thirdWindow.style.visibility = 'hidden';
  closeButton.style.visibility = 'visible';
  closeButton.style.opacity = '1';
}









// Corrected toggleRegionWindow function
function toggleRegionWindow() {
  // Toggle only if the subregion and third windows are not visible
  if (!isSubRegionWindowVisible && !isThirdWindowVisible) {
    isRegionWindowVisible = !isRegionWindowVisible;

    if (isRegionWindowVisible) {
      regionWindow.style.visibility = 'visible';
      regionWindow.style.opacity = '1';
    } else {
      regionWindow.style.opacity = '0';
      setTimeout(() => {
        regionWindow.style.visibility = 'hidden';
      }, 500);
    }
  }
}

// Corrected closeAllWindows function
function closeAllWindows() {
  // Hide all sub-windows
  subRegionWindow.style.opacity = '0';
  thirdWindow.style.opacity = '0';
  fourthWindow.style.opacity = '0';
  closeButton.style.opacity = '0';

  setTimeout(() => {
    subRegionWindow.style.visibility = 'hidden';
    thirdWindow.style.visibility = 'hidden';
    fourthWindow.style.visibility = 'hidden';
    closeButton.style.visibility = 'hidden';

    // Reset flags for all windows
    isSubRegionWindowVisible = false;
    isThirdWindowVisible = false;

    // Only show the region window if it was initially visible
    if (isRegionWindowVisible) {
      regionWindow.style.visibility = 'visible';
      regionWindow.style.opacity = '1';
    }
  }, 500);
}

// Click event for closing all windows
closeButton.addEventListener('click', closeAllWindows);

// Click event for toggling the region window on the entire page
renderer.domElement.addEventListener('click', toggleRegionWindow);

// Click event for "Close" button
closeButton.addEventListener('click', closeAllWindows);

// Обработчик движения мыши для вращения глобуса
renderer.domElement.addEventListener('mousemove', (evt) => {
  pointerPos.set(
    (evt.clientX / window.innerWidth) * 2 - 1, 
    -(evt.clientY / window.innerHeight) * 2 + 1
  );
});
// Обработчик клика на глобусе
renderer.domElement.addEventListener('click', toggleRegionWindow);


//окна для текстур 












////--- Текстура ---////
function toggleTexture() {
  // Calculate the next texture index
  const newTextureIndex = (currentTextureIndex + 1) % textures.length;

  // Check if the texture has changed
  if (newTextureIndex !== currentTextureIndex) {
    // Set needsUpdate to false before updating the texture
    uniforms.colorTexture.needsUpdate = false;

    // Update the current texture index
    currentTextureIndex = newTextureIndex;

    // Update the shader uniform with the new texture
    uniforms.colorTexture.value = textures[currentTextureIndex];
    uniforms.colorTexture.needsUpdate = true;

    // Hide all windows before showing the correct one
    [windowForTexture2, windowForTexture3, windowForTexture4, windowForTexture5].forEach((window) => {
      window.style.display = 'none';
    });

    // Show the corresponding window for the current texture
    if (currentTextureIndex === 1) windowForTexture2.style.display = 'block';
    else if (currentTextureIndex === 2) windowForTexture3.style.display = 'block';
    else if (currentTextureIndex === 3) windowForTexture4.style.display = 'block';
    else if (currentTextureIndex === 4) windowForTexture5.style.display = 'block';
    
    
  }
}



// Add event listener to the button
button.addEventListener('click', toggleTexture);

function handleRaycast(){
  raycaster.setFromCamera(pointerPos, camera);
  const intersects = raycaster.intersectObjects([globe]); 
  if (intersects.length > 0){
    globeUV.copy(intersects[0].uv);
  }
  uniforms.mouseUV.value = globeUV;
}

function animate(t = 0) {
  requestAnimationFrame(animate);

  // Rotate the globe only if needed
  if (globeGroup.rotation.y < Math.PI * 4) {
    globeGroup.rotation.y = t * 0.0001;
  }

  handleRaycast();
  renderer.render(scene, camera);
  controls.update();
}


animate();
