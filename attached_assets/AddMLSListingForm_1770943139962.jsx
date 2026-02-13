import { useState, useRef, useCallback, useMemo } from 'react';
import { Save, X, Upload, Image, FolderOpen, Search, ChevronDown, ChevronRight, Link } from 'lucide-react';


const TOP_LEVEL_FIELDS = [
  'address','city','state','zip','price','status','is_new_listing','listing_id',
  'property_type','property_sub_type','beds','baths_full','baths_three_quarter',
  'baths_half','sqft','year_built','lot_size','levels','garage_spaces','subdivision',
  'description','directions','parking','laundry','cooling','heating','fireplace',
  'patio_porch','pool','view_description','sewer','eating_area','appliances',
  'interior_features','flooring','association_fee','association_fee_frequency',
  'high_school_district','mls_area','county','special_conditions','assessments',
  'tax_annual_amount','land_lease','original_price','listing_agent','listing_office',
  'open_house_date','open_house_time','photos'
];

const TABS = ['Status','Basics','Description','Features','Land/Terms','Office/MLS','Green','Power Production','ADU','Open House'];

const STATUS_OPTIONS = ['Coming Soon','Active','Act Under Contract','Pending','Closed','Expired','Cancelled','Hold','Withdrawn'];
const COUNTY_OPTIONS = ['Orange','Los Angeles','San Diego','Riverside','San Bernardino','Ventura','Santa Barbara','Kern','Imperial'];
const STREET_DIR_OPTIONS = ['','E','N','NE','NW','S','SE','SW','W'];
const STREET_SUFFIX_OPTIONS = ['','Alley','Avenue','Blvd','Circle','Court','Drive','Lane','Place','Road','Street','Terrace','Trail','Way'];
const PROPERTY_SUB_TYPE_OPTIONS = ['Single Family Residence','Stock Cooperative','Condominium','Townhouse','Multi-Family','Mobile Home'];
const STRUCTURE_TYPE_OPTIONS = ['None','Cabin','Dock','Duplex','House','Modular','Quadruplex','Triplex'];
const SPECIAL_CONDITIONS_OPTIONS = ['Standard','Notice Of Default','Real Estate Owned','HUD Owned','Short Sale','Probate Listing','Auction','Bankruptcy Property','Third Party Approval','Trust','Conservatorship'];
const LEVELS_OPTIONS = ['One','Two','Three Or More','Multi/Split'];
const YEAR_BUILT_SOURCE_OPTIONS = ['','Appraiser','Assessor','Builder','Estimated','Other','Owner','Public Records','See Remarks'];
const LIVING_AREA_SOURCE_OPTIONS = ['','Appraiser','Assessor','Builder','Estimated','Other','Owner','Public Records','See Remarks'];
const LOT_SIZE_SOURCE_OPTIONS = ['','Appraiser','Assessor','Builder','Estimated','Other','Owner','Public Records','See Remarks'];

const INTERIOR_FEATURES_OPTIONS = ['2 Staircases','Attic Fan','Balcony','Bar','Beamed Ceilings','Block Walls','Brick Walls','Built-in Features','Cathedral Ceiling(s)','Ceiling Fan(s)','Ceramic Counters','Chair Railings','Coffered Ceiling(s)','Copper Plumbing Full','Copper Plumbing Partial','Corian Counters','Crown Molding','Dry Bar','Dumbwaiter','Electronic Air Cleaner','Elevator','Formica Counters','Furnished','Granite Counters','High Ceilings','Home Automation System','In-Law Floorplan','Intercom','Laminate Counters','Living Room Balcony','Living Room Deck Attached','Open Floorplan','Pantry','Partially Furnished','Phone System','Pull Down Stairs to Attic','Quartz Counters','Recessed Lighting','Stair Climber','Stone Counters','Storage','Sump Pump','Sunken Living Room','Suspended Ceiling(s)','Tandem','Tile Counters','Track Lighting','Trash Chute','Tray Ceiling(s)','Two Story Ceilings','Unfinished Walls','Unfurnished','Vacuum Central','Wainscoting','Wet Bar','Wired for Data','Wired for Sound','Wood Product Walls'];
const BASEMENT_OPTIONS = ['Finished','Unfinished','Utility'];
const COOLING_OPTIONS = ['None','Central Air','Dual','Ductless','Electric','ENERGY STAR Qualified Equipment','Evaporative Cooling','Gas','Heat Pump','High Efficiency','Humidity Control','SEER Rated 13-15','SEER Rated 16+','See Remarks','Wall/Window Unit(s)','Whole House Fan','Zoned'];
const HEATING_OPTIONS = ['None','Baseboard','Central','Combination','Ductless','Electric','ENERGY STAR Qualified Equipment','Fireplace(s)','Floor Furnace','Forced Air','Gravity','Heat Pump','High Efficiency','Humidity Control','Kerosene','Natural Gas','Oil','Pellet Stove','Propane','Radiant','See Remarks','Solar','Space Heater','Wall Furnace','Wood','Wood Stove','Zoned'];
const ACCESSIBILITY_OPTIONS = ['None','2+ Access Exits','32 Inch Or More Wide Doors','36 Inch Or More Wide Halls','48 Inch Or More Wide Halls','Accessible Elevator Installed','Adaptable For Elevator','Customized Wheelchair Accessible','Disability Features','Doors - Swing In','Entry Slope Less Than 1 Foot','Grab Bars In Bathroom(s)','Low Pile Carpeting','Lowered Light Switches','No Interior Steps','Other','Parking','Ramp - Main Level','See Remarks'];
const APPLIANCES_OPTIONS = ['None','6 Burner Stove','Barbecue','Built-In Range','Coal Water Heater','Convection Oven','Dishwasher','Double Oven','Electric Oven','Electric Range','Electric Cooktop','Electric Water Heater','ENERGY STAR Qualified Appliances','ENERGY STAR Qualified Water Heater','Free-Standing Range','Freezer','Disposal','Gas & Electric Range','Gas Oven','Gas Range','Gas Cooktop','Gas Water Heater','Indoor Grill','High Efficiency Water Heater','Hot Water Circulator','Ice Maker','Instant Hot Water','Microwave','No Hot Water','Portable Dishwasher','Propane Oven','Propane Range','Propane Cooktop','Propane Water Heater','Range Hood','Recirculated Exhaust Fan','Refrigerator','Self Cleaning Oven','Solar Hot Water','Tankless Water Heater','Trash Compactor','Vented Exhaust Fan','Warming Drawer','Water Heater Central','Water Heater','Water Line to Refrigerator','Water Purifier','Water Softener'];
const BATHROOM_FEATURES_OPTIONS = ['Bathtub','Bidet','Low Flow Shower','Low Flow Toilet(s)','Shower','Shower in Tub','Closet in bathroom','Corian Counters','Double sinks in bath(s)','Double Sinks in Primary Bath','Dual shower heads (or Multiple)','Exhaust fan(s)','Formica Counters','Granite Counters','Heated Floor','Hollywood Bathroom (Jack&Jill)','Humidity controlled','Jetted Tub','Laminate Counters','Linen Closet/Storage','Main Floor Full Bath','Privacy toilet door','Quartz Counters','Remodeled','Separate tub and shower','Soaking Tub','Stone Counters','Tile Counters','Upgraded','Vanity area','Walk-in shower'];
const LAUNDRY_OPTIONS = ['None','Common Area','Community','Dryer Included','Electric Dryer Hookup','Gas & Electric Dryer Hookup','Gas Dryer Hookup','In Carport','In Closet','In Garage','In Kitchen','Individual Room','Inside','Laundry Chute','Upper Level','Outside','Propane Dryer Hookup','See Remarks','Stackable','Washer Hookup','Washer Included'];
const ROOM_TYPE_OPTIONS = ['All Bedrooms Down','All Bedrooms Up','Art Studio','Atrium','Attic','Basement','Bonus Room','Center Hall','Converted Bedroom','Dance Studio','Den','Dressing Area','Entry','Exercise Room','Family Room','Formal Entry','Foyer','Galley Kitchen','Game Room','Great Room','Guest/Maid\'s Quarters','Home Theatre','Jack & Jill','Kitchen','Laundry','Library','Living Room','Loft','Main Floor Bedroom','Main Floor Primary Bedroom','Primary Bathroom','Primary Bedroom','Primary Suite','Media Room','Multi-Level Bedroom','Office','Projection','Recreation','Retreat','Sauna','See Remarks','Separate Family Room','Sound Studio','Sun','Two Primaries','Utility Room','Walk-In Closet','Walk-In Pantry','Wine Cellar','Workshop'];
const FIREPLACE_OPTIONS = ['None','Bath','Bonus Room','Den','Dining Room','Family Room','Game Room','Guest House','Kitchen','Library','Living Room','Circulating','Primary Bedroom','Primary Retreat','Outside','Patio','Electric','Gas','Gas Starter','Pellet Stove','Propane','Wood Burning','Wood Stove Insert','Blower Fan','Circular','Decorative','Fire Pit','Free Standing','Great Room','Heatilator','Masonry','Raised Hearth','Zero Clearance','See Through','Two Way','See Remarks'];
const KITCHEN_FEATURES_OPTIONS = ['Built-in Trash/Recycling','Butler\'s Pantry','Corian Counters','Formica Counters','Granite Counters','Kitchen Island','Kitchen Open to Family Room','Kitchenette','Laminate Counters','Pots & Pan Drawers','Quartz Counters','Remodeled Kitchen','Self-closing cabinet doors','Self-closing drawers','Stone Counters','Tile Counters','Utility sink','Walk-In Pantry'];
const FLOORING_OPTIONS = ['Bamboo','Brick','Carpet','Concrete','Laminate','See Remarks','Stone','Tile','Vinyl','Wood'];
const EATING_AREA_OPTIONS = ['Area','Breakfast Counter / Bar','Breakfast Nook','Dining Ell','Family Kitchen','In Family Room','Dining Room','In Kitchen','In Living Room','Separated','Country Kitchen','See Remarks'];
const ELECTRIC_OPTIONS = ['220 Volts For Spa','220 Volts in Garage','220 Volts in Kitchen','220 Volts in Laundry','220 Volts in Workshop','220V Other - See Remarks','220 Volts','440 Volts','Electricity - On Bond','Electricity - On Property','Electricity - Unknown','Heavy','Photovoltaics on Grid','Photovoltaics Seller Owned','Photovoltaics Stand-Alone','Photovoltaics Third-Party Owned','Standard'];
const UTILITIES_OPTIONS = ['None','Cable Available','Cable Connected','Cable Not Available','Electricity Available','Electricity Connected','Electricity Not Available','Natural Gas Available','Natural Gas Connected','Natural Gas Not Available','Other','Phone Available','Phone Connected','Phone Not Available','Propane','See Remarks','Sewer Available','Sewer Connected','Sewer Not Available','Underground Utilities','Water Available','Water Connected','Water Not Available'];

const POOL_OPTIONS = ['None','Private','Association','Community','Above Ground','Black Bottom','Diving Board','Exercise Pool','Fenced','Fiberglass','Filtered','Gunite','Heated','Heated Passively','Electric Heat','Gas Heat','Heated with Propane','In Ground','Indoor','Lap','Infinity','No Permits','Pebble','Permits','Pool Cover','Roof Top','Salt Water','See Remarks','Solar Heat','Tile','Vinyl','Waterfall'];
const SPA_OPTIONS = ['None','Private','Association','Community','Above Ground','Bath','Fiberglass','Gunite','Heated','In Ground','No Permits','Permits','Roof Top','See Remarks','Solar Heated','Vinyl'];
const COMMON_WALLS_OPTIONS = ['1 Common Wall','2+ Common Walls','End Unit','No Common Walls','No One Above','No One Below'];
const PATIO_PORCH_OPTIONS = ['None','Arizona Room','Brick','Cabana','Concrete','Covered','Deck','Enclosed','Enclosed Glass Porch','Lanai','Patio','Patio Open','Porch','Front Porch','Rear Porch','Roof Top','Screened','Screened Porch','See Remarks','Slab','Stone','Terrace','Tile','Wood','Wrap Around'];
const ARCHITECTURAL_STYLE_OPTIONS = ['Bungalow','Cape Cod','Colonial','Contemporary','Cottage','Craftsman','Custom Built','English','French','Georgian','Log','Mediterranean','Mid Century Modern','Modern','Ranch','See Remarks','Shotgun','Spanish','Traditional','Tudor','Victorian'];
const VIEW_OPTIONS = ['None','Back Bay','Dunes','Bay','Bluff','Bridge(s)','Canal','Canyon','Catalina','City Lights','Coastline','Courtyard','Creek/Stream','Desert','Golf Course','Harbor','Hills','Lake','Landmark','Marina','Meadow','Mountain(s)','Neighborhood','Ocean','Orchard','Panoramic','Park/Greenbelt','Pasture','Peek-A-Boo','Pier','Pond','Pool','Reservoir','River','Rocks','See Remarks','Trees/Woods','Valley','Vincent Thomas Bridge','Vineyard','Water','White Water'];
const DOOR_FEATURES_OPTIONS = ['Atrium Doors','Double Door Entry','ENERGY STAR Qualified Doors','French Doors','Insulated Doors','Mirror Closet Door(s)','Panel Doors','Service Entrance','Sliding Doors','Storm Door(s)'];
const FENCING_OPTIONS = ['None','Average Condition','Barbed Wire','Block','Brick','Chain Link','Cross Fenced','Electric','Excellent Condition','Fair Condition','Glass','Goat Type','Good Condition','Grapestake','Invisible','Livestock','Masonry','Needs Repair','New Condition','Partial','Pipe','Poor Condition','Privacy','Redwood','Security','See Remarks','Split Rail','Stone','Stucco Wall','Vinyl','Wire','Wood','Wrought Iron'];
const CONSTRUCTION_OPTIONS = ['Adobe','Alcan','Aluminum Siding','Asbestos','Asphalt','Block','Blown-In Insulation','Board & Batten Siding','Brick','Brick Veneer','Cedar','Cellulose Insulation','Cement Siding','Clapboard','Concrete','Drywall Walls','Ducts Professionally Air-Sealed','Fiber Cement','Fiberglass Siding','Flagstone','Frame','Glass','Hardboard','HardiPlank Type','ICFs (Insulated Concrete Forms)','Lap Siding','Log','Log Siding','Masonite','Metal Siding','Natural Building','NES Insulation Pkg','Other','Plaster','Radiant Barrier','Rammed Earth','Redwood Siding','Shake Siding','Shingle Siding','Slump Block','Spray Foam Insulation','Steel','Steel Siding','Stone','Stone Veneer','Straw','Stucco','Synthetic Stucco','TVA Insulation Pkg','Unknown','Vertical Siding','Vinyl Siding','Wood Siding'];
const ROOF_OPTIONS = ['None','Asbestos Shingle','Asphalt','Bahama','Barrel','Bitumen','Bituthene','Clay','Common Roof','Composition','Concrete','Copper','Elastomeric','Fiberglass','Fire Retardant','Flat','Flat Tile','Foam','Green Roof','Mansard','Membrane','Metal','Mixed','Other','Reflective','Ridge Vents','Rolled/Hot Mop','See Remarks','Shake','Shingle','Slate','Spanish Tile','Stone','Synthetic','Tar/Gravel','Tile','Wood'];
const LOT_FEATURES_OPTIONS = ['0-1 Unit/Acre','2-5 Units/Acre','6-10 Units/Acre','11-15 Units/Acre','16-20 Units/Acre','21-25 Units/Acre','26-30 Units/Acre','31-35 Units/Acre','36-40 Units/Acre','Agricultural','Agricultural - Dairy','Agricultural - Other','Agricultural - Row/Crop','Agricultural - Tree/Orchard','Agricultural - Vine/Vineyard','Back Yard','Bluff','Close to Clubhouse','Corner Lot','Corners Marked','Cul-De-Sac','Desert Back','Desert Front','Sloped Down','Front Yard','Garden','Gentle Sloping','Greenbelt','Horse Property','Horse Property Improved','Horse Property Unimproved','Landscaped','Lawn','Level with Street','Lot 10000-19999 Sqft','Lot 20000-39999 Sqft','Lot 6500-9999','Lot Over 40000 Sqft','Flag Lot','Irregular Lot','Rectangular Lot','Level','Misting System','Near Public Transit','No Landscaping','On Golf Course','Over 40 Units/Acre','Park Nearby','Pasture','Patio Home','Paved','Percolate','Ranch','Rocks','Rolling Slope','Secluded','Sprinkler System','Sprinklers Drip System','Sprinklers In Front','Sprinklers In Rear','Sprinklers Manual','Sprinklers None','Sprinklers On Side','Sprinklers Timer','Steep Slope','Tear Down','Treed Lot','Up Slope from Street','Utilities - Overhead','Value In Land','Walkstreet','Yard','Zero Lot Line'];
const COMMUNITY_FEATURES_OPTIONS = ['Biking','BLM/National Forest','Curbs','Dog Park','Fishing','Foothills','Golf','Hiking','Gutters','Lake','Horse Trails','Park','Hunting','Watersports','Military Land','Mountainous','Preserve/Public Land','Ravine','Stable(s)','Rural','Sidewalks','Storm Drains','Street Lights','Suburban','Urban','Valley'];
const ROAD_FRONTAGE_OPTIONS = ['Access is Seasonal','Access Road','Alley','City Street','Country Road','County Road','Highway','Private Road'];
const ROAD_SURFACE_OPTIONS = ['Alley Paved','Gravel','Not Maintained','Paved','Privately Maintained','Unpaved'];
const DISCLOSURES_OPTIONS = ['Accessory Dwelling Unit','3rd Party Rights','Bankruptcy','Beach Rights','Cautions Call Agent','CC And R\'s','City Inspection Required','Coastal Commission Restrictions','Coastal Zone','Conditional Use Permit','Court Confirmation','Death On Property < 3 yrs','Earthquake Insurance Available','Easements','Environmental Restrictions','Exclusions Call Agent','Flood Insurance Required','Flood Zone','HERO/PACE Loan','Historical','Home Warranty','Homeowners Association','Incorporated','LA/Owner Related','Licensed Vacation Rental','Listing Broker Advantage','Manufactured Homes Allowed','Methane Gas','Mineral Rights','Moratorium','No Lake Rights','Oil Rights','Open Space Restrictions','Pet Restrictions','Principal Is RE Licensed','Private Transfer Taxes','Property Report','REAP','Redevelopment Area','Rent Control','Seismic Hazard','Seller Will Pay Sec. 1 Termite','Slide Zone','Special Study Area','Subject To Estate Ruling','Tenants In Common - DRE Pink','Tenants In Common - DRE White','Unincorporated','Water Rights','Well Log Available'];
const EXTERIOR_FEATURES_OPTIONS = ['Awning(s)','Balcony','Barbecue Private','Boat Lift','Boat Slip','Corral','Dock Private','Kennel','Koi Pond','Lighting','Pier','Rain Gutters','Satellite Dish','Stable','Sump Pump','TV Antenna'];
const SECURITY_OPTIONS = ['24 Hour Security','Gated with Attendant','Automatic Gate','Carbon Monoxide Detector(s)','Card/Code Access','Closed Circuit Camera(s)','Fire and Smoke Detection System','Fire Rated Drywall','Fire Sprinkler System','Firewall(s)','Gated Community','Gated with Guard','Guarded','Resident Manager','Security Lights','Security System','Smoke Detector(s)','Window Bars','Wired for Alarm System'];
const FOUNDATION_OPTIONS = ['None','Block','Brick/Mortar','Combination','Concrete Perimeter','Permanent','Pier Jacks','Pillar/Post/Pier','Quake Bracing','Raised','See Remarks','Seismic Tie Down','Slab','Stacked Block','Stone','Tie Down'];
const PROPERTY_CONDITION_OPTIONS = ['Additions/Alterations','Building Permit','Fixer','Repairs Cosmetic','Repairs Major','Termite Clearance','Turnkey','Under Construction','Updated/Remodeled'];
const OTHER_STRUCTURES_OPTIONS = ['Airplane Hangar','Aviary','Barn(s)','Gazebo','Greenhouse','Guest House','Guest House Attached','Guest House Detached','Outbuilding','Sauna Private','Second Garage','Second Garage Attached','Second Garage Detached','Shed(s)','Sport Court Private','Storage','Tennis Court Private','Two On A Lot','Workshop'];
const PARKING_OPTIONS = ['None','Assigned','Auto Driveway Gate','Boat','Built-In Storage','Carport','Attached Carport','Detached Carport','Circular Driveway','Community Structure','Controlled Entrance','Converted Garage','Covered','Deck','Direct Garage Access','Driveway','Asphalt','Driveway - Brick','Driveway - Combination','Concrete','Gravel','Paved','Unpaved','Driveway Blind','Driveway Down Slope From Street','Driveway Level','Driveway Up Slope From Street','Electric Vehicle Charging Station(s)','Garage','Garage Faces Front','Garage Faces Rear','Garage Faces Side','Garage - Single Door','Garage - Three Door','Garage - Two Door','Garage Door Opener','Gated','Golf Cart Garage','Guarded','Guest','Heated Garage','Metered','No Driveway','Off Site','Off Street','On Site','Other','Oversized','Parking Space','Permit Required','Porte-Cochere','Private','Public','Pull-through','RV Access/Parking','RV Covered','RV Garage','RV Gated','RV Hook-Ups','RV Potential','See Remarks','Shared Driveway','Side by Side','Street','Structure','Subterranean','Tandem Covered','Tandem Garage','Tandem Uncovered','Unassigned','Uncovered','Valet','Workshop in Garage'];
const WATERFRONT_OPTIONS = ['Across the Road from Lake/Ocean','Bay Front','Beach Access','Beach Front','Canal Front','Creek','Fishing in Community','Includes Dock','Lagoon','Lake','Lake Front','Lake Privileges','Marina in Community','Navigable Water','Ocean Access','Ocean Front','Ocean Side of Freeway','Ocean Side Of Highway 1','Pond','Reservoir in Community','River Front','Sea Front','Seawall','Stream','Waterfront With Home Across Road'];
const SEWER_OPTIONS = ['None','Aerobic Septic','Cesspool','Conventional Septic','Engineered Septic','Holding Tank','Mound Septic','Other','Perc Test On File','Perc Test Required','Private Sewer','Public Sewer','Septic Type Unknown','Sewer Applied for Permit','Sewer Assessments','Sewer On Bond','Sewer Paid','Shared Septic','Soils Analysis Septic','Unknown'];
const WATER_SOURCE_OPTIONS = ['Mutual Water Companies','None','Agricultural Well','Cistern','Other','Private','Public','See Remarks','Shared Well','Well'];
const WINDOW_FEATURES_OPTIONS = ['Atrium','Bay Window(s)','Blinds','Casement Windows','Custom Covering','Double Pane Windows','Drapes','ENERGY STAR Qualified Windows','French/Mullioned','Garden Window(s)','Insulated Windows','Jalousies/Louvered','Low Emissivity Windows','Palladian','Plantation Shutters','Roller Shields','Screens','Shutters','Skylight(s)','Solar Screens','Solar Tinted Windows','Stained Glass','Storm Window(s)','Tinted Windows','Triple Pane Windows','Wood Frames'];

const ASSESSMENTS_OPTIONS = ['None','Special Assessments','CFD/Mello-Roos','Sewer Assessments','Sewer Bonds','Unknown'];
const HOA_AMENITIES_OPTIONS = ['Pickleball','Pool','Spa/Hot Tub','Sauna','Fire Pit','Barbecue','Outdoor Cooking Area','Tennis Court(s)','Basketball Court','Playground','Clubhouse','Fitness Center','Dog Park','Trail(s)','Golf Course','Billiard Room','Meeting Room','Storage','Security','Concierge','Elevator(s)','Lobby'];
const POSSESSION_OPTIONS = ['Close Of Escrow','Close Plus','Close Plus 1 Day','Close Plus 2 Days','Close Plus 3 Days','Negotiable','See Remarks'];
const CURRENT_FINANCING_OPTIONS = ['None','FHA','VA','Assumable','Cal Vet Loan','Contract','Conventional'];
const LISTING_TERMS_OPTIONS = ['1031 Exchange','Cal Vet Loan','Cash','Cash To Existing Loan','Cash to New Loan','Contract','Conventional'];

const GREEN_ENERGY_EFFICIENT_OPTIONS = ['Appliances','Construction','Doors','Exposure/Shade','HVAC','Incentives','Insulation','Lighting','Roof','Thermostat','Water Heater','Windows'];
const GREEN_ENERGY_GENERATION_OPTIONS = ['Geothermal','Solar','Wind'];
const GREEN_SUSTAINABILITY_OPTIONS = ['Biodegradable Materials','Conserving Methods','Recycled Materials','Renewable Materials'];
const GREEN_WATER_OPTIONS = ['Flow Control','Reclamation','Water-Smart Landscaping'];
const GREEN_VERIFICATION_TYPE_OPTIONS = ['','Pearl Certification','California Green Builder','Energy Performance Score (EPS)','ENERGY STAR Certified Homes','Enterprise Green Communities','Indoor airPLUS','WaterSense'];

const ADU_KITCHEN_OPTIONS = ['Range','Refrigerator','See Remarks','Sink','Stove'];
const ADU_LEVELS_OPTIONS = ['One','Two','Three or More','Multi/Split'];
const ADU_ACCESS_OPTIONS = ['Garage','See Remarks','Separate','Shared','Slider'];

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm';
const labelClass = 'block text-xs font-medium text-gray-600 mb-1';
const sectionTitleClass = 'text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200';

function getDefaultForm() {
  return {
    status: 'Active',
    price: '',
    price_low: '',
    parcel_number_available: 'No',
    parcel_number: '',
    additional_parcels: 'No',
    addl_parcels: '',
    seller_concessions: false,
    county: 'Orange',
    city: '',
    mls_area: '',
    neighborhood: '',
    subdivision: '',
    subdivision_name_other: '',
    street_number: '',
    street_number_ext: '',
    street_dir_prefix: '',
    street_name: '',
    street_suffix: '',
    street_suffix_modifier: '',
    street_dir_suffix: '',
    unit_number: '',
    state: 'CA',
    zip: '',
    zip_plus4: '',
    country: 'US',
    directions: '',
    land_lease: 'No',
    structure_type: [],
    common_interest: '',
    property_type: 'Residential',
    property_sub_type: 'Single Family Residence',
    certified_433a: 'No',
    year_built: '',
    year_built_source: '',
    is_new_listing: false,
    special_conditions: [],
    beds: '',
    baths_full: '',
    baths_three_quarter: '',
    baths_half: '',
    baths_quarter: '',
    sqft: '',
    living_area_source: '',
    lot_size: '',
    lot_size_source: '',
    living_area_units: 'Square Feet',
    number_of_units: '',
    lot_size_units: '',
    garage_spaces: '',
    senior_community: 'No',
    hoa: 'No',
    lease_considered: 'No',
    levels: [],
    stories_total: '',
    entry_location: '',
    entry_level: '',
    below_grade_finished_area: '',
    below_grade_units: '',
    probate_authority: '',
    listing_id: '',
    description: '',
    exclusions: '',
    inclusions: '',
    virtual_tour_url: '',
    interior_features: [],
    basement: [],
    cooling: [],
    heating: [],
    accessibility: [],
    appliances: [],
    bathroom_features: [],
    laundry: [],
    room_type: [],
    fireplace: [],
    kitchen_features: [],
    flooring: [],
    eating_area: [],
    electric: [],
    utilities: [],
    pool: [],
    spa: [],
    common_walls: [],
    patio_porch: [],
    architectural_style: [],
    view_description: [],
    door_features: [],
    fencing: [],
    construction_materials: [],
    roof: [],
    lot_features: [],
    community_features: [],
    road_frontage: [],
    road_surface: [],
    disclosures: [],
    exterior_features: [],
    security_features: [],
    foundation: [],
    property_condition: [],
    other_structures: [],
    parking: [],
    waterfront: [],
    sewer: [],
    water_source: [],
    window_features: [],
    main_level_bedrooms: '',
    main_level_bathrooms: '',
    attached_garage: 'No',
    uncovered_spaces: '',
    number_remotes: '',
    carport_spaces: '',
    rv_parking_dimensions: '',
    direction_faces: '',
    tax_lot: '',
    zoning: '',
    units_in_community: '',
    tax_block: '',
    tax_tract_number: '',
    builder_model: '',
    lot_size_dimensions: '',
    tax_census_tract: '',
    tax_model: '',
    lot_dimensions_source: '',
    make: '',
    builder_name: '',
    tax_tract: '',
    well_depth: '',
    well_gpm: '',
    well_hp: '',
    well_report: 'No',
    tax_other_assessment: '',
    tax_other_assess_source: '',
    elevation: '',
    elevation_units: 'Feet',
    assessments: [],
    association_fee: '',
    association_fee_frequency: 'Monthly',
    hoa_name: '',
    hoa_phone: '',
    hoa_mgmt: '',
    association_fee_2: '',
    association_fee_2_frequency: 'Monthly',
    hoa_name_2: '',
    hoa_phone_2: '',
    hoa_mgmt_2: '',
    association_fee_3: '',
    association_fee_3_frequency: 'Monthly',
    hoa_name_3: '',
    hoa_phone_3: '',
    hoa_mgmt_3: '',
    hoa_amenities: [],
    land_lease_renewal_date: '',
    land_lease_amount: '',
    land_lease_frequency: '',
    land_lease_transfer_fee: '',
    land_lease_purchase: 'No',
    high_school_district: '',
    high_school: '',
    hs_district_source: '',
    hs_source: '',
    hs_other: '',
    middle_school: '',
    ms_source: '',
    ms_other: '',
    elementary_school: '',
    es_source: '',
    es_other: '',
    possession: [],
    current_financing: [],
    listing_terms: [],
    serial_u: '',
    serial_x: '',
    serial_xx: '',
    doh1: '',
    doh2: '',
    doh3: '',
    license1: '',
    license2: '',
    license3: '',
    lockbox_type: [],
    lockbox_version: '',
    lockbox_serial: '',
    internet_listing_display: 'Yes',
    internet_address_display: 'Yes',
    internet_consumer_comment: 'Yes',
    internet_avm_display: 'Yes',
    neighborhood_report: 'Yes',
    private_remarks: '',
    listing_agent: 'INEWTCHE',
    co_list_agent: '',
    offers_email: 'cherylnewton2@cox.net',
    photographer_id: '',
    list_team_id: '',
    co_list_team_id: '',
    listing_office: '',
    green_verification: 'No',
    green_energy_efficient: [],
    green_energy_generation: [],
    green_sustainability: [],
    green_water: [],
    walk_score: '',
    green_verification_type: '',
    green_verification_body: '',
    green_verification_rating: '',
    green_verification_year: '',
    power_production: 'No',
    power_production_type: '',
    power_production_size: '',
    power_production_year: '',
    power_production_annual: '',
    power_production_ownership: '',
    power_production_annual_status: '',
    adu: 'No',
    adu_type: '',
    adu_separate_address: 'No',
    adu_entry_level: '',
    adu_electric_meter: '',
    adu_beds: '',
    adu_baths: '',
    adu_parking: 'No',
    adu_gas_meter: '',
    adu_occupied: 'No',
    adu_year_built: '',
    adu_year_built_source: '',
    adu_water_meter: '',
    adu_living_area: '',
    adu_living_area_source: '',
    adu_attached: 'No',
    adu_rented: 'No',
    adu_rented_until: '',
    adu_rent: '',
    adu_kitchen: [],
    adu_levels: [],
    adu_access: [],
    open_house_date: '',
    open_house_time_start: '',
    open_house_time_end: '',
    showing_agent: 'Cheryl',
    attended: '',
    refreshments: '',
    drawing: 'No',
    open_house_type: '',
    virtual_open_house_url: '',
    open_house_comments: '',
    open_house_active: 'Yes',
    tax_annual_amount: '',
    original_price: '',
    open_house_time: '',
    address: '',
    photos: [],
  };
}

function MultiSelectPanel({ label, options, selected, onChange }) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const filtered = useMemo(() => {
    if (!search) return options;
    const s = search.toLowerCase();
    return options.filter(o => o.toLowerCase().includes(s));
  }, [options, search]);

  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {collapsed ? <ChevronRight size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
          <span className="text-xs font-semibold text-gray-700">{label}</span>
        </div>
        {selected.length > 0 && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{selected.length}</span>
        )}
      </button>
      {!collapsed && (
        <div className="p-2">
          <div className="relative mb-2">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter..."
              className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-0.5">
            {filtered.map(opt => (
              <label key={opt} className="flex items-center gap-1.5 py-0.5 cursor-pointer hover:bg-gray-50 rounded px-1">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 leading-tight">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CardSection({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <h3 className={sectionTitleClass}>{title}</h3>
      {children}
    </div>
  );
}

export default function AddMLSListingForm({ listing, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState(() => {
    const defaults = getDefaultForm();
    if (listing) {
      const merged = { ...defaults };
      Object.keys(listing).forEach(key => {
        if (key === 'photos') {
          merged.photos = listing.photos ? [...listing.photos] : [];
        } else if (key === 'mls_data' && typeof listing.mls_data === 'object') {
          Object.keys(listing.mls_data).forEach(mk => {
            if (mk in merged) merged[mk] = listing.mls_data[mk];
          });
        } else if (key in merged) {
          merged[key] = listing[key];
        }
      });
      if (listing.address) {
        const parts = listing.address.split(' ');
        if (parts.length > 1 && /^\d+$/.test(parts[0])) {
          merged.street_number = parts[0];
          merged.street_name = parts.slice(1).join(' ');
        } else {
          merged.street_name = listing.address;
        }
      }
      return merged;
    }
    return defaults;
  });

  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const set = useCallback((field, value) => setForm(f => ({ ...f, [field]: value })), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const topLevel = {};
    const mlsData = {};

    topLevel.address = [form.street_number, form.street_dir_prefix, form.street_name, form.street_suffix].filter(Boolean).join(' ').trim();
    topLevel.city = form.city;
    topLevel.state = form.state;
    topLevel.zip = form.zip;
    topLevel.price = form.price;
    topLevel.status = form.status;
    topLevel.is_new_listing = form.is_new_listing;
    topLevel.listing_id = form.listing_id;
    topLevel.property_type = form.property_type;
    topLevel.property_sub_type = form.property_sub_type;
    topLevel.beds = form.beds;
    topLevel.baths_full = form.baths_full;
    topLevel.baths_three_quarter = form.baths_three_quarter;
    topLevel.baths_half = form.baths_half;
    topLevel.sqft = form.sqft;
    topLevel.year_built = form.year_built;
    topLevel.lot_size = form.lot_size;
    topLevel.levels = Array.isArray(form.levels) ? form.levels.join(', ') : form.levels;
    topLevel.garage_spaces = form.garage_spaces;
    topLevel.subdivision = form.subdivision;
    topLevel.description = form.description;
    topLevel.directions = form.directions;
    topLevel.parking = Array.isArray(form.parking) ? form.parking.join(', ') : form.parking;
    topLevel.laundry = Array.isArray(form.laundry) ? form.laundry.join(', ') : form.laundry;
    topLevel.cooling = Array.isArray(form.cooling) ? form.cooling.join(', ') : form.cooling;
    topLevel.heating = Array.isArray(form.heating) ? form.heating.join(', ') : form.heating;
    topLevel.fireplace = Array.isArray(form.fireplace) ? form.fireplace.join(', ') : form.fireplace;
    topLevel.patio_porch = Array.isArray(form.patio_porch) ? form.patio_porch.join(', ') : form.patio_porch;
    topLevel.pool = Array.isArray(form.pool) ? form.pool.join(', ') : form.pool;
    topLevel.view_description = Array.isArray(form.view_description) ? form.view_description.join(', ') : form.view_description;
    topLevel.sewer = Array.isArray(form.sewer) ? form.sewer.join(', ') : form.sewer;
    topLevel.eating_area = Array.isArray(form.eating_area) ? form.eating_area.join(', ') : form.eating_area;
    topLevel.appliances = Array.isArray(form.appliances) ? form.appliances.join(', ') : form.appliances;
    topLevel.interior_features = Array.isArray(form.interior_features) ? form.interior_features.join(', ') : form.interior_features;
    topLevel.flooring = Array.isArray(form.flooring) ? form.flooring.join(', ') : form.flooring;
    topLevel.association_fee = form.association_fee;
    topLevel.association_fee_frequency = form.association_fee_frequency;
    topLevel.high_school_district = form.high_school_district;
    topLevel.mls_area = form.mls_area;
    topLevel.county = form.county;
    topLevel.special_conditions = Array.isArray(form.special_conditions) ? form.special_conditions.join(', ') : form.special_conditions;
    topLevel.assessments = Array.isArray(form.assessments) ? form.assessments.join(', ') : form.assessments;
    topLevel.tax_annual_amount = form.tax_annual_amount;
    topLevel.land_lease = form.land_lease;
    topLevel.original_price = form.original_price;
    topLevel.listing_agent = form.listing_agent;
    topLevel.listing_office = form.listing_office;
    topLevel.open_house_date = form.open_house_date;
    topLevel.open_house_time = form.open_house_time_start && form.open_house_time_end ? `${form.open_house_time_start}-${form.open_house_time_end}` : form.open_house_time;
    topLevel.photos = form.photos;

    const topLevelKeys = new Set(TOP_LEVEL_FIELDS);
    const skipKeys = new Set(['address', 'street_number', 'street_number_ext', 'street_dir_prefix', 'street_name', 'street_suffix', 'street_suffix_modifier', 'street_dir_suffix']);
    Object.keys(form).forEach(key => {
      if (!topLevelKeys.has(key) && !skipKeys.has(key)) {
        mlsData[key] = form[key];
      }
    });

    onSave({ ...topLevel, mls_data: mlsData });
  };

  const removePhoto = (i) => setForm(f => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }));

  const uploadFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) formData.append('photos', file);
      });
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setForm(f => ({ ...f, photos: [...f.photos, ...data.urls] }));
      } else {
        const errData = await res.json().catch(() => ({}));
        setUploadError('Photo upload is not available right now. Use the "Add URL" option below to paste image links instead.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Photo upload is not available right now. Use the "Add URL" option below to paste image links instead.');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }, [uploadFiles]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }, []);
  const handleFileSelect = (e) => { uploadFiles(e.target.files); e.target.value = ''; };

  const tabHasData = useMemo(() => {
    const check = (fields) => fields.some(f => {
      const v = form[f];
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'boolean') return v;
      return v && v !== '' && v !== 'No' && v !== getDefaultForm()[f];
    });
    return [
      form.status !== 'Active',
      check(['price','street_number','street_name','city','zip','beds','baths_full','sqft','year_built']),
      check(['description','exclusions','inclusions','virtual_tour_url']),
      check(['interior_features','basement','cooling','heating','accessibility','appliances','bathroom_features','laundry','room_type','fireplace','kitchen_features','flooring','eating_area','electric','utilities','pool','spa','common_walls','patio_porch','architectural_style','view_description','door_features','fencing','construction_materials','roof','lot_features','community_features','road_frontage','road_surface','disclosures','exterior_features','security_features','foundation','property_condition','other_structures','parking','waterfront','sewer','water_source','window_features']),
      check(['tax_lot','zoning','association_fee','high_school_district','assessments']),
      check(['lockbox_type','private_remarks','listing_agent','offers_email']),
      check(['green_energy_efficient','green_energy_generation','green_sustainability','green_water','walk_score']),
      check(['power_production_type','power_production_size']),
      form.adu === 'Yes',
      check(['open_house_date','open_house_time_start']),
    ];
  }, [form]);

  const renderInput = (label, field, type = 'text', opts = {}) => (
    <div>
      <label className={labelClass}>{label}{opts.required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        className={inputClass}
        placeholder={opts.placeholder || ''}
        required={opts.required}
      />
    </div>
  );

  const renderSelect = (label, field, options, opts = {}) => (
    <div>
      <label className={labelClass}>{label}</label>
      <select value={form[field]} onChange={e => set(field, e.target.value)} className={inputClass}>
        {options.map(o => <option key={o} value={o}>{o || '—'}</option>)}
      </select>
    </div>
  );

  const renderYesNo = (label, field) => renderSelect(label, field, ['No', 'Yes']);

  const renderTextarea = (label, field, maxLen, rows = 4) => (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        rows={rows}
        value={form[field]}
        onChange={e => { if (!maxLen || e.target.value.length <= maxLen) set(field, e.target.value); }}
        className={inputClass}
      />
      {maxLen && (
        <p className="text-xs text-gray-400 mt-1 text-right">{maxLen - (form[field]?.length || 0)} characters remaining</p>
      )}
    </div>
  );

  const renderCheckboxGroup = (label, field, options) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map(opt => {
          const checked = Array.isArray(form[field]) ? form[field].includes(opt) : false;
          return (
            <label key={opt} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs cursor-pointer transition-colors ${checked ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const arr = Array.isArray(form[field]) ? form[field] : [];
                  set(field, checked ? arr.filter(v => v !== opt) : [...arr, opt]);
                }}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'}`}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-blue-600 font-medium text-sm">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload size={20} className="text-blue-600" />
            </div>
            <p className="text-gray-700 font-medium text-sm">Drag & drop images here</p>
            <p className="text-gray-400 text-xs">or click to browse files</p>
          </div>
        )}
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs font-medium">
          <Image size={14} /> Add Images
        </button>
        <button type="button" onClick={() => folderInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs font-medium">
          <FolderOpen size={14} /> Add Folder
        </button>
        <input ref={folderInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" {...{ webkitdirectory: '', directory: '' }} />
      </div>
      {uploadError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          {uploadError}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="Paste image URL (https://...)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            if (photoUrl.trim()) {
              setForm(f => ({ ...f, photos: [...f.photos, photoUrl.trim()] }));
              setPhotoUrl('');
            }
          }}
          className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
        >
          <Link size={14} />
          Add URL
        </button>
      </div>
      {form.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {form.photos.map((url, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" onError={e => { e.target.src = ''; e.target.className = 'w-full h-full bg-gray-200'; }} />
              <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <X size={12} />
              </button>
              {i === 0 && <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded font-medium">Main</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStatusTab = () => (
    <CardSection title="Listing Status">
      <div className="max-w-md">
        <label className={labelClass}>Status</label>
        <div className="grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => set('status', s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${form.status === s ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 max-w-md">
        {renderInput('MLS Listing ID', 'listing_id')}
      </div>
    </CardSection>
  );

  const renderBasicsTab = () => (
    <>
      <CardSection title="Listing Information">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {renderInput('List Price', 'price', 'number', { required: true })}
          {renderInput('List Price Low', 'price_low', 'number')}
          {renderYesNo('Parcel Number Available?', 'parcel_number_available')}
          {renderInput('Parcel Number', 'parcel_number')}
          {renderYesNo('Additional Parcels?', 'additional_parcels')}
          {renderInput('Addl Parcels', 'addl_parcels')}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.seller_concessions} onChange={e => set('seller_concessions', e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
              <span className="text-xs font-medium text-gray-700">Seller Consider Concessions?</span>
            </label>
          </div>
        </div>
      </CardSection>

      <CardSection title="Location">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {renderSelect('County', 'county', COUNTY_OPTIONS)}
          {renderInput('City', 'city')}
          {renderInput('MLS Area', 'mls_area')}
          {renderInput('Neighborhood', 'neighborhood')}
          {renderInput('Subdivision', 'subdivision')}
          {renderInput('Subdivision Name Other', 'subdivision_name_other')}
        </div>
      </CardSection>

      <CardSection title="Address">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {renderInput('Street #', 'street_number', 'text', { required: true })}
          {renderInput('Street # Extension', 'street_number_ext')}
          {renderSelect('Street Direction Prefix', 'street_dir_prefix', STREET_DIR_OPTIONS)}
          {renderInput('Street Name', 'street_name', 'text', { required: true })}
          {renderSelect('Street Suffix', 'street_suffix', STREET_SUFFIX_OPTIONS)}
          {renderInput('Street Suffix Modifier', 'street_suffix_modifier')}
          {renderSelect('Street Direction Suffix', 'street_dir_suffix', STREET_DIR_OPTIONS)}
          {renderInput('Unit #', 'unit_number')}
          {renderInput('State', 'state')}
          {renderInput('Postal Code', 'zip')}
          {renderInput('Postal Code +4', 'zip_plus4')}
          {renderInput('Country', 'country')}
        </div>
      </CardSection>

      <CardSection title="Directions">
        {renderTextarea('Directions', 'directions', null, 3)}
      </CardSection>

      <CardSection title="Basic Information">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {renderYesNo('Land Lease?', 'land_lease')}
          <div>
            <label className={labelClass}>Structure Type</label>
            <div className="flex flex-wrap gap-1.5">
              {STRUCTURE_TYPE_OPTIONS.map(opt => {
                const checked = form.structure_type.includes(opt);
                return (
                  <label key={opt} className={`text-xs px-2 py-1 rounded border cursor-pointer ${checked ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                    <input type="checkbox" checked={checked} onChange={() => set('structure_type', checked ? form.structure_type.filter(v => v !== opt) : [...form.structure_type, opt])} className="sr-only" />
                    {opt}
                  </label>
                );
              })}
            </div>
          </div>
          {renderInput('Common Interest', 'common_interest')}
          {renderSelect('Property Sub Type', 'property_sub_type', PROPERTY_SUB_TYPE_OPTIONS)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {renderYesNo('Certified 433a?', 'certified_433a')}
          {renderInput('Year Built', 'year_built', 'number')}
          {renderSelect('Year Built Source', 'year_built_source', YEAR_BUILT_SOURCE_OPTIONS)}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_new_listing} onChange={e => set('is_new_listing', e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
              <span className="text-xs font-medium text-gray-700">New Construction?</span>
            </label>
          </div>
        </div>
        <div className="mt-3">
          {renderCheckboxGroup('Special Listing Conditions', 'special_conditions', SPECIAL_CONDITIONS_OPTIONS)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
          {renderInput('Beds Total', 'beds', 'number')}
          {renderInput('Baths Full', 'baths_full', 'number')}
          {renderInput('Baths 3/4', 'baths_three_quarter', 'number')}
          {renderInput('Baths 1/2', 'baths_half', 'number')}
          {renderInput('Baths 1/4', 'baths_quarter', 'number')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {renderInput('Living Area', 'sqft', 'number')}
          {renderSelect('Living Area Source', 'living_area_source', LIVING_AREA_SOURCE_OPTIONS)}
          {renderInput('Lot Size Area', 'lot_size')}
          {renderSelect('Lot Size Source', 'lot_size_source', LOT_SIZE_SOURCE_OPTIONS)}
          {renderSelect('Living Area Units', 'living_area_units', ['Square Feet'])}
          {renderInput('# of Units', 'number_of_units', 'number')}
          {renderInput('Lot Size Units', 'lot_size_units')}
          {renderInput('Garage Spaces', 'garage_spaces', 'number')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {renderYesNo('Senior Community?', 'senior_community')}
          {renderYesNo('HOA?', 'hoa')}
          {renderYesNo('Lease Considered?', 'lease_considered')}
        </div>
        <div className="mt-3">
          {renderCheckboxGroup('Levels', 'levels', LEVELS_OPTIONS)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {renderInput('Stories Total', 'stories_total', 'number')}
          {renderInput('Entry Location', 'entry_location')}
          {renderInput('Entry Level', 'entry_level')}
          {renderInput('Below Grade Finished Area', 'below_grade_finished_area', 'number')}
          {renderInput('Below Grd Fin Area Units', 'below_grade_units')}
          {renderInput('Probate Authority', 'probate_authority')}
        </div>
      </CardSection>

      <CardSection title="Photos">
        {renderPhotos()}
      </CardSection>
    </>
  );

  const renderDescriptionTab = () => (
    <CardSection title="Listing Description">
      <div className="space-y-4">
        {renderTextarea('Public Remarks', 'description', 2500, 6)}
        {renderInput('Exclusions', 'exclusions')}
        {renderInput('Inclusions', 'inclusions')}
        {renderInput('Virtual Tour URL', 'virtual_tour_url', 'url')}
      </div>
    </CardSection>
  );

  const renderFeaturesTab = () => (
    <>
      <CardSection title="Interior Features">
        <div className="grid md:grid-cols-2 gap-3">
          <MultiSelectPanel label="Interior Features" options={INTERIOR_FEATURES_OPTIONS} selected={form.interior_features} onChange={v => set('interior_features', v)} />
          <MultiSelectPanel label="Basement" options={BASEMENT_OPTIONS} selected={form.basement} onChange={v => set('basement', v)} />
          <MultiSelectPanel label="Cooling" options={COOLING_OPTIONS} selected={form.cooling} onChange={v => set('cooling', v)} />
          <MultiSelectPanel label="Heating" options={HEATING_OPTIONS} selected={form.heating} onChange={v => set('heating', v)} />
          <MultiSelectPanel label="Accessibility Features" options={ACCESSIBILITY_OPTIONS} selected={form.accessibility} onChange={v => set('accessibility', v)} />
          <MultiSelectPanel label="Appliances" options={APPLIANCES_OPTIONS} selected={form.appliances} onChange={v => set('appliances', v)} />
          <MultiSelectPanel label="Bathroom Features" options={BATHROOM_FEATURES_OPTIONS} selected={form.bathroom_features} onChange={v => set('bathroom_features', v)} />
          <MultiSelectPanel label="Laundry" options={LAUNDRY_OPTIONS} selected={form.laundry} onChange={v => set('laundry', v)} />
          <MultiSelectPanel label="Room Type" options={ROOM_TYPE_OPTIONS} selected={form.room_type} onChange={v => set('room_type', v)} />
          <MultiSelectPanel label="Fireplace" options={FIREPLACE_OPTIONS} selected={form.fireplace} onChange={v => set('fireplace', v)} />
          <MultiSelectPanel label="Kitchen Features" options={KITCHEN_FEATURES_OPTIONS} selected={form.kitchen_features} onChange={v => set('kitchen_features', v)} />
          <MultiSelectPanel label="Flooring" options={FLOORING_OPTIONS} selected={form.flooring} onChange={v => set('flooring', v)} />
          <MultiSelectPanel label="Eating Area" options={EATING_AREA_OPTIONS} selected={form.eating_area} onChange={v => set('eating_area', v)} />
          <MultiSelectPanel label="Electric" options={ELECTRIC_OPTIONS} selected={form.electric} onChange={v => set('electric', v)} />
          <MultiSelectPanel label="Utilities" options={UTILITIES_OPTIONS} selected={form.utilities} onChange={v => set('utilities', v)} />
        </div>
      </CardSection>

      <CardSection title="Exterior Features">
        <div className="grid md:grid-cols-2 gap-3">
          <MultiSelectPanel label="Pool Features" options={POOL_OPTIONS} selected={form.pool} onChange={v => set('pool', v)} />
          <MultiSelectPanel label="Spa Features" options={SPA_OPTIONS} selected={form.spa} onChange={v => set('spa', v)} />
          <MultiSelectPanel label="Common Walls" options={COMMON_WALLS_OPTIONS} selected={form.common_walls} onChange={v => set('common_walls', v)} />
          <MultiSelectPanel label="Patio and Porch" options={PATIO_PORCH_OPTIONS} selected={form.patio_porch} onChange={v => set('patio_porch', v)} />
          <MultiSelectPanel label="Architectural Style" options={ARCHITECTURAL_STYLE_OPTIONS} selected={form.architectural_style} onChange={v => set('architectural_style', v)} />
          <MultiSelectPanel label="View" options={VIEW_OPTIONS} selected={form.view_description} onChange={v => set('view_description', v)} />
          <MultiSelectPanel label="Door Features" options={DOOR_FEATURES_OPTIONS} selected={form.door_features} onChange={v => set('door_features', v)} />
          <MultiSelectPanel label="Fencing" options={FENCING_OPTIONS} selected={form.fencing} onChange={v => set('fencing', v)} />
          <MultiSelectPanel label="Construction Materials" options={CONSTRUCTION_OPTIONS} selected={form.construction_materials} onChange={v => set('construction_materials', v)} />
          <MultiSelectPanel label="Roof" options={ROOF_OPTIONS} selected={form.roof} onChange={v => set('roof', v)} />
          <MultiSelectPanel label="Lot Features" options={LOT_FEATURES_OPTIONS} selected={form.lot_features} onChange={v => set('lot_features', v)} />
          <MultiSelectPanel label="Community Features" options={COMMUNITY_FEATURES_OPTIONS} selected={form.community_features} onChange={v => set('community_features', v)} />
          <MultiSelectPanel label="Road Frontage Type" options={ROAD_FRONTAGE_OPTIONS} selected={form.road_frontage} onChange={v => set('road_frontage', v)} />
          <MultiSelectPanel label="Road Surface Type" options={ROAD_SURFACE_OPTIONS} selected={form.road_surface} onChange={v => set('road_surface', v)} />
          <MultiSelectPanel label="Disclosures" options={DISCLOSURES_OPTIONS} selected={form.disclosures} onChange={v => set('disclosures', v)} />
          <MultiSelectPanel label="Exterior Features" options={EXTERIOR_FEATURES_OPTIONS} selected={form.exterior_features} onChange={v => set('exterior_features', v)} />
          <MultiSelectPanel label="Security Features" options={SECURITY_OPTIONS} selected={form.security_features} onChange={v => set('security_features', v)} />
          <MultiSelectPanel label="Foundation Details" options={FOUNDATION_OPTIONS} selected={form.foundation} onChange={v => set('foundation', v)} />
          <MultiSelectPanel label="Property Condition" options={PROPERTY_CONDITION_OPTIONS} selected={form.property_condition} onChange={v => set('property_condition', v)} />
          <MultiSelectPanel label="Other Structures" options={OTHER_STRUCTURES_OPTIONS} selected={form.other_structures} onChange={v => set('other_structures', v)} />
          <MultiSelectPanel label="Parking" options={PARKING_OPTIONS} selected={form.parking} onChange={v => set('parking', v)} />
          <MultiSelectPanel label="Waterfront Features" options={WATERFRONT_OPTIONS} selected={form.waterfront} onChange={v => set('waterfront', v)} />
          <MultiSelectPanel label="Sewer" options={SEWER_OPTIONS} selected={form.sewer} onChange={v => set('sewer', v)} />
          <MultiSelectPanel label="Water Source" options={WATER_SOURCE_OPTIONS} selected={form.water_source} onChange={v => set('water_source', v)} />
          <MultiSelectPanel label="Window Features" options={WINDOW_FEATURES_OPTIONS} selected={form.window_features} onChange={v => set('window_features', v)} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {renderInput('Main Level Bedrooms', 'main_level_bedrooms', 'number')}
          {renderInput('Main Level Bathrooms', 'main_level_bathrooms', 'number')}
          {renderYesNo('Attached Garage?', 'attached_garage')}
          {renderInput('Uncovered Spaces', 'uncovered_spaces', 'number')}
          {renderInput('Number Remotes', 'number_remotes', 'number')}
          {renderInput('Carport Spaces', 'carport_spaces', 'number')}
          {renderInput('RV Parking Dimensions', 'rv_parking_dimensions')}
          {renderInput('Direction Faces', 'direction_faces')}
        </div>
      </CardSection>
    </>
  );

  const renderLandTermsTab = () => (
    <>
      <CardSection title="Land Information">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {renderInput('Tax Lot', 'tax_lot')}
          {renderInput('Zoning', 'zoning')}
          {renderInput('Units in Community', 'units_in_community', 'number')}
          {renderInput('Tax Block', 'tax_block')}
          {renderInput('Tax Tract Number', 'tax_tract_number')}
          {renderInput('Builder Model', 'builder_model')}
          {renderInput('Lot Size Dimensions', 'lot_size_dimensions')}
          {renderInput('Tax Census Tract', 'tax_census_tract')}
          {renderInput('Tax Model', 'tax_model')}
          {renderSelect('Lot Dimensions Source', 'lot_dimensions_source', ['','Appraiser','Assessor','Builder','Estimated','Other','Owner','Public Records','See Remarks'])}
          {renderInput('Make', 'make')}
          {renderInput('Builder Name', 'builder_name')}
          {renderInput('Tax Tract', 'tax_tract')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {renderInput('Well Depth', 'well_depth', 'number')}
          {renderInput('Well Gallons/Min', 'well_gpm', 'number')}
          {renderInput('Well Pump HP', 'well_hp', 'number')}
          {renderYesNo('Well Report?', 'well_report')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {renderInput('Tax Other Assessment', 'tax_other_assessment', 'number')}
          {renderSelect('Tax Other Assess Source', 'tax_other_assess_source', ['','Appraiser','Assessor','Other','Public Records','See Remarks'])}
          {renderInput('Elevation', 'elevation', 'number')}
          {renderSelect('Elevation Units', 'elevation_units', ['Feet','Meters'])}
        </div>
        <div className="mt-3">
          {renderCheckboxGroup('Assessments', 'assessments', ASSESSMENTS_OPTIONS)}
        </div>
      </CardSection>

      <CardSection title="Association/HOA">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {renderInput('HOA Fee', 'association_fee', 'number')}
          {renderSelect('HOA Fee Frequency', 'association_fee_frequency', ['Monthly','Quarterly','Annually'])}
          {renderInput('HOA Name', 'hoa_name')}
          {renderInput('HOA Phone', 'hoa_phone')}
          {renderInput('HOA Management', 'hoa_mgmt')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
          {renderInput('HOA Fee 2', 'association_fee_2', 'number')}
          {renderSelect('Fee 2 Frequency', 'association_fee_2_frequency', ['Monthly','Quarterly','Annually'])}
          {renderInput('HOA Name 2', 'hoa_name_2')}
          {renderInput('HOA Phone 2', 'hoa_phone_2')}
          {renderInput('HOA Management 2', 'hoa_mgmt_2')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
          {renderInput('HOA Fee 3', 'association_fee_3', 'number')}
          {renderSelect('Fee 3 Frequency', 'association_fee_3_frequency', ['Monthly','Quarterly','Annually'])}
          {renderInput('HOA Name 3', 'hoa_name_3')}
          {renderInput('HOA Phone 3', 'hoa_phone_3')}
          {renderInput('HOA Management 3', 'hoa_mgmt_3')}
        </div>
        <div className="mt-3">
          {renderCheckboxGroup('HOA Amenities', 'hoa_amenities', HOA_AMENITIES_OPTIONS)}
        </div>
      </CardSection>

      <CardSection title="Lease/Fees">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className={labelClass}>Land Lease Renewal Date</label>
            <input type="date" value={form.land_lease_renewal_date} onChange={e => set('land_lease_renewal_date', e.target.value)} className={inputClass} />
          </div>
          {renderInput('Land Lease Amount', 'land_lease_amount', 'number')}
          {renderSelect('Amount Frequency', 'land_lease_frequency', ['','Monthly','Quarterly','Annually'])}
          {renderInput('Transfer Fee', 'land_lease_transfer_fee', 'number')}
          {renderYesNo('Land Lease Purchase?', 'land_lease_purchase')}
        </div>
      </CardSection>

      <CardSection title="School Information">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {renderInput('High School District', 'high_school_district')}
          {renderInput('High School', 'high_school')}
          {renderInput('HS District Source', 'hs_district_source')}
          {renderInput('HS Source', 'hs_source')}
          {renderInput('HS Other', 'hs_other')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {renderInput('Middle/Junior School', 'middle_school')}
          {renderInput('MS Source', 'ms_source')}
          {renderInput('MS Other', 'ms_other')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {renderInput('Elementary School', 'elementary_school')}
          {renderInput('ES Source', 'es_source')}
          {renderInput('ES Other', 'es_other')}
        </div>
      </CardSection>

      <CardSection title="Financial">
        <div className="space-y-3">
          {renderCheckboxGroup('Possession', 'possession', POSSESSION_OPTIONS)}
          {renderCheckboxGroup('Current Financing', 'current_financing', CURRENT_FINANCING_OPTIONS)}
          {renderCheckboxGroup('Listing Terms', 'listing_terms', LISTING_TERMS_OPTIONS)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {renderInput('Tax Annual Amount', 'tax_annual_amount', 'number')}
          {renderInput('Original Price', 'original_price', 'number')}
        </div>
      </CardSection>

      <CardSection title="Serial and License">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {renderInput('Serial (U)', 'serial_u')}
          {renderInput('Serial (X)', 'serial_x')}
          {renderInput('Serial (XX)', 'serial_xx')}
          {renderInput('DOH1', 'doh1')}
          {renderInput('DOH2', 'doh2')}
          {renderInput('DOH3', 'doh3')}
          {renderInput('License1', 'license1')}
          {renderInput('License2', 'license2')}
          {renderInput('License3', 'license3')}
        </div>
      </CardSection>
    </>
  );

  const renderOfficeMlsTab = () => (
    <>
      <CardSection title="Lock Box">
        <div className="space-y-3">
          {renderCheckboxGroup('Lock Box Type', 'lockbox_type', ['SentriLock', 'Supra'])}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {renderSelect('Lock Box Version', 'lockbox_version', ['','Bluetooth','Non-Bluetooth','iBox BT LE','iBox BT'])}
            {renderInput('Lock Box Serial Number', 'lockbox_serial')}
          </div>
        </div>
      </CardSection>

      <CardSection title="Internet Display">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {renderYesNo('Internet Entire Listing Display?', 'internet_listing_display')}
          {renderYesNo('Internet Address Display?', 'internet_address_display')}
          {renderYesNo('Internet Consumer Comment?', 'internet_consumer_comment')}
          {renderYesNo('Internet Automated Valuation Display?', 'internet_avm_display')}
          {renderYesNo('Neighborhood Market Report?', 'neighborhood_report')}
        </div>
      </CardSection>

      <CardSection title="Private Remarks">
        {renderTextarea('Private Remarks', 'private_remarks', 1500, 5)}
      </CardSection>

      <CardSection title="Agent Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {renderInput('List Agent MLS ID', 'listing_agent')}
          {renderInput('Co-List Agent MLS ID', 'co_list_agent')}
          {renderInput('Offers Email', 'offers_email', 'email')}
          {renderInput('Photographer MLS ID', 'photographer_id')}
          {renderInput('List Team ID', 'list_team_id')}
          {renderInput('Co-List Team ID', 'co_list_team_id')}
          {renderInput('Listing Office', 'listing_office')}
        </div>
      </CardSection>
    </>
  );

  const renderGreenTab = () => (
    <CardSection title="Green Features">
      <div className="space-y-4">
        <div className="max-w-xs">
          {renderYesNo('Green Verification?', 'green_verification')}
        </div>
        {renderCheckboxGroup('Green Energy Efficient', 'green_energy_efficient', GREEN_ENERGY_EFFICIENT_OPTIONS)}
        {renderCheckboxGroup('Green Energy Generation', 'green_energy_generation', GREEN_ENERGY_GENERATION_OPTIONS)}
        {renderCheckboxGroup('Green Sustainability', 'green_sustainability', GREEN_SUSTAINABILITY_OPTIONS)}
        {renderCheckboxGroup('Green Water Conservation', 'green_water', GREEN_WATER_OPTIONS)}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {renderInput('WalkScore', 'walk_score', 'number')}
          {renderSelect('Green Building Verification Type', 'green_verification_type', GREEN_VERIFICATION_TYPE_OPTIONS)}
          {renderInput('Green Verification Body', 'green_verification_body')}
          {renderInput('Green Verification Rating', 'green_verification_rating')}
          {renderInput('Green Verification Year', 'green_verification_year', 'number')}
        </div>
      </div>
    </CardSection>
  );

  const renderPowerTab = () => (
    <CardSection title="Power Production">
      <div className="space-y-4">
        <div className="max-w-xs">
          {renderYesNo('Power Production?', 'power_production')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {renderSelect('Power Production Type', 'power_production_type', ['','Photovoltaics','Wind','Geothermal','Other'])}
          {renderInput('Size (kW)', 'power_production_size', 'number')}
          {renderInput('Year Installed', 'power_production_year', 'number')}
          {renderInput('Annual Production (kWh)', 'power_production_annual', 'number')}
          {renderSelect('Ownership', 'power_production_ownership', ['','Owned','Leased','PPA'])}
          {renderSelect('Annual Status', 'power_production_annual_status', ['','Actual','Estimated','Projected'])}
        </div>
      </div>
    </CardSection>
  );

  const renderAduTab = () => (
    <CardSection title="Accessory Dwelling Unit (ADU)">
      <div className="space-y-4">
        <div className="max-w-xs">
          {renderYesNo('ADU?', 'adu')}
        </div>
        {form.adu === 'Yes' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderSelect('ADU Type', 'adu_type', ['','Attached','Detached','Junior','Garage Conversion','Above Garage'])}
              {renderYesNo('Separate Address?', 'adu_separate_address')}
              {renderSelect('Entry Level', 'adu_entry_level', ['','Ground Level','Second Level','Basement'])}
              {renderSelect('Electric Meter', 'adu_electric_meter', ['','Shared','Separate'])}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderInput('# Beds', 'adu_beds', 'number')}
              {renderInput('# Baths', 'adu_baths', 'number')}
              {renderYesNo('Parking?', 'adu_parking')}
              {renderSelect('Gas Meter', 'adu_gas_meter', ['','Shared','Separate'])}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderYesNo('Occupied?', 'adu_occupied')}
              {renderInput('Year Built', 'adu_year_built', 'number')}
              {renderSelect('Year Built Source', 'adu_year_built_source', YEAR_BUILT_SOURCE_OPTIONS)}
              {renderSelect('Water Meter', 'adu_water_meter', ['','Shared','Separate'])}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderInput('Living Area', 'adu_living_area', 'number')}
              {renderSelect('Living Area Source', 'adu_living_area_source', LIVING_AREA_SOURCE_OPTIONS)}
              {renderYesNo('Attached?', 'adu_attached')}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderYesNo('Rented?', 'adu_rented')}
              <div>
                <label className={labelClass}>Rented Until</label>
                <input type="date" value={form.adu_rented_until} onChange={e => set('adu_rented_until', e.target.value)} className={inputClass} />
              </div>
              {renderInput('Rent $', 'adu_rent', 'number')}
            </div>
            {renderCheckboxGroup('Kitchen Features', 'adu_kitchen', ADU_KITCHEN_OPTIONS)}
            {renderCheckboxGroup('Property ADU Levels', 'adu_levels', ADU_LEVELS_OPTIONS)}
            {renderCheckboxGroup('Property Access Type', 'adu_access', ADU_ACCESS_OPTIONS)}
          </>
        )}
      </div>
    </CardSection>
  );

  const renderOpenHouseTab = () => (
    <CardSection title="Open House">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" value={form.open_house_date} onChange={e => set('open_house_date', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Time Start</label>
            <input type="time" value={form.open_house_time_start} onChange={e => set('open_house_time_start', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Time End</label>
            <input type="time" value={form.open_house_time_end} onChange={e => set('open_house_time_end', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {renderInput('Showing Agent', 'showing_agent')}
          {renderSelect('Attended', 'attended', ['','Agent','Office Staff','Showing Service','None'])}
          {renderInput('Refreshments', 'refreshments')}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {renderYesNo('Drawing', 'drawing')}
          {renderSelect('Open House Type', 'open_house_type', ['','Public','Broker','Office','Private'])}
          {renderInput('Virtual Open House URL', 'virtual_open_house_url', 'url')}
        </div>
        {renderTextarea('Comments', 'open_house_comments', null, 3)}
        <div className="max-w-xs">
          {renderYesNo('Active', 'open_house_active')}
        </div>
      </div>
    </CardSection>
  );

  const tabContent = [
    renderStatusTab,
    renderBasicsTab,
    renderDescriptionTab,
    renderFeaturesTab,
    renderLandTermsTab,
    renderOfficeMlsTab,
    renderGreenTab,
    renderPowerTab,
    renderAduTab,
    renderOpenHouseTab,
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">
          {listing ? 'Edit MLS Listing' : 'Add MLS Listing'}
        </h2>
      </div>

      <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === i
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
              {tabHasData[i] && (
                <span className={`absolute top-1.5 right-1 w-2 h-2 rounded-full ${activeTab === i ? 'bg-blue-400' : 'bg-green-400'}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {tabContent[activeTab]()}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button type="submit" disabled={uploading} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 shadow-sm">
          <Save size={16} />
          {uploading ? 'Uploading...' : 'Save Listing'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
          Cancel
        </button>
        {activeTab < TABS.length - 1 && (
          <button type="button" onClick={() => setActiveTab(activeTab + 1)} className="ml-auto px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm">
            Next: {TABS[activeTab + 1]} →
          </button>
        )}
      </div>
    </form>
  );
}
