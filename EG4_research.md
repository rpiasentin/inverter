# EG4 Cloud and API research

## Overview
This document summarizes findings from web searches and forum posts about the EG4 cloud and API. The EG4 inverter family uses a web-based monitoring system sometimes called SolarCloudSystem. Some community members have written libraries to communicate with this API.

### Key references
- [EG4 API Documentation](https://eg4electronics.com/api-documentation/) lists B2B and Cloud API resources for EG4 products. It provides official instructions for integrating with EG4 equipment via the cloud.
- [Integrating EG4/SolarCloudSystem Web API with Home Assistant](https://diysolarforum.com/threads/integrating-eg4-solarcloudsystem-web-api-with-home-assistant-an-incomplete-guide.101087/) is a user forum post describing how to pull inverter data via the cloud API and use it inside Home Assistant.
- [EG4 REST API thread](https://diysolarforum.com/threads/eg4-rest-api.98576/) shows community discussion about the lack of a local LAN API and the reliance on cloud access for EG4 data.
- GitHub project [twistedroutes/eg4_inverter_api](https://github.com/twistedroutes/eg4_inverter_api) exposes sync and async methods for querying EG4 inverter data. It can be used from Python to integrate with automation systems.

### Air conditioner integration
EG4 offers Solar Mini-Split Air Conditioners that can run on both DC power from solar panels and AC power from the grid. Example product pages include:
- [EG4 Hybrid Solar Mini-Split Air Conditioner](https://signaturesolar.com/eg4-hybrid-solar-mini-split-air-conditioner-heat-pump-ac-dc-12000-btu-seer2-22-plug-n-cool-do-it-yourself-installation/)
- [EG4® 24k Hybrid Solar Mini-split](https://eg4electronics.com/categories/high-efficiency-appliances/eg4-24k-hybrid-solar-unit/)

These units feature app-based control via the Solar Aircon app. When integrating them with an inverter system, monitoring power usage and battery status through the EG4 cloud API ensures the air conditioner operates without depleting the battery bank.

## Recommendations
- Use the `eg4_inverter_api` Python library or a similar HTTP client to interface with the EG4 cloud API for reading inverter status and battery state of charge.
- Monitor API rate limits and authentication requirements from the official EG4 API documentation.
- For controlling air conditioners, rely on the Solar Aircon app or integrate via Home Assistant using sensors from the EG4 API to automate when the unit runs based on available solar or battery power.

