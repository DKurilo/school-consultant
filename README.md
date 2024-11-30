# school consultant
## Why?
Each student in the US at some point has to decide what high schools they want to join. 
Some high schools can help to have high academic achievements, after some of them a student can start earning money, other allow a student to feel they are belongs. 
And building a list of high schools in a proper order is a task that is difficult even for adults. And almost impossible for students. 
My son has to go through this exercise. And he is struggling with this task. It's hard to think about your life goals when you are 13. Especially when live is always changing. Relocations, COVID, computers, artificial intelligence... It can be hard to digest for child. 
## How it works
So I build this system to help my son. And because this is hard even for me I decided it's good chance to try to exploit artificial intelligence. So system makes some requests to AI and then builds a list of schools in the way it's simple to read it and process it. Surely distance to school is a huge factor and AI is not good in defining time to travel. So system also uses Google Maps API to get some data. 
Maybe most interesting things are happens in `packages/api-fast-and-dirty/src/gateways/openai-schools-list-getter.ts' and in `packages/api-fast-and-dirty/src/gateways/openai-strategy-generator.ts`. And feel free to right me if you think about better requests to OpenAI. I'm new in prompt-engineering, so can use any help here. 
## Run locally
To start system you need to set up server (I didn't have time to write IaC yet, maybe later), generate GoogleMaps and OpenAI keys and create new user (check `tools/generate-user.mjs` script to do this). 
You can also run it locally. Just copy `packages/fe-fast-and-dirty/.env.example` and `packages/api-fast-and-dirty/.env.example` to `.env.developmen` and then run api and fe. I would recommend use two terminals for this. 
In the first one run `npm run start:api:dev` and in the second one `npm run start:fe`. After system is started just open `http://localhost:3000` in your browser. 
To add you as user run `node ./tools/generate-user.mjs your-email 1000000`. You will have password in console. So log in using your email and password. 
## Use and Contribute
If you just want to use the system write me email to `dkurilo@gmail.com`. Each request costs money, small money for each, like building about 20 recommendations and viewing them costs me about $1.5, and the cheapest server I used costs some money as well. But I still have to pay it. 
We can decide how you can contribute. Maybe you can improve the system, prompts, give some good recommendation, money to support the server, or to improve my moral :) . 
The URL where the system is running right now is: https://schools.kurilo.us/
## Examples
System allows to build and to share recommendation. Shared recommendation looks like in these examples:
* https://schools.kurilo.us/?ro-token=dMeYcAMjiexQDcKManUynjo5mRdxdp5AxKUMRDY1dJ
* https://schools.kurilo.us/?ro-token=AtUp8YqBwtsUr78e9s2ypeZN8c73UrhtwSIm9yruo4
* https://schools.kurilo.us/?ro-token=cyb98Am5QXTiPfdlVMpcFy8aar8egsc8prwYivY4wT
## Feedback
If you want to say something to me, my email is `dkurilo@gmail.com`. Also you can open issue/PR in this repo.
