import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import banner from "../../public/banner.webp"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {

  const [longUrl, setLongUrl] = useState<string>()
  const navigate = useNavigate()

  const handleShorten = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <h2 className="m-10 sm:my-16 text-3xl sm:text-6x; lg:text-7xl text-white text-center font-extrabold">
      The Only URL Shortner <br /> you&rsquo;ll ever need! 👇
      </h2> 

      <form onSubmit={handleShorten} className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2">
        <Input type="url" 
        placeholder="Enter your long url"  
        className="border-white text-white h-full flex py-4 px-4"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
    
        />
        <Button variant="outline" className="text-white h-full" type="submit">Shorten</Button>

      </form>
      <img src={banner} alt="banner" className="w-full my-11 md:px-11 flex" />

      <Accordion type="multiple"  defaultValue={[]} className="w-full text-white md:px-11">
  <AccordionItem value="item-1">
    <AccordionTrigger>How does the URL Shortener work?</AccordionTrigger>
    <AccordionContent>
      Shortly takes long URLs and converts them into shorter, more manageable links. Simply paste your long URL into the input field and click "Shorten." The service generates a unique short link that redirects users to the original URL. This makes sharing links easier, especially on platforms with character limits.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-2">
    <AccordionTrigger>Do I need an app to use the service?</AccordionTrigger>
    <AccordionContent>
      No, you don’t need to download any app to use Shortly. It’s a web-based platform accessible from any browser on desktop, tablet, or mobile devices. Just visit the website, shorten your links, and access your analytics without the need for additional software.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-3">
    <AccordionTrigger>Why are analytics available for my shortened URL?</AccordionTrigger>
    <AccordionContent>
      Analytics provide valuable insights into how your links are performing. Shortly offers data on the number of clicks, geographic locations of your audience, devices used, and more. This helps you track engagement, measure the effectiveness of campaigns, and make informed decisions when sharing links.
    </AccordionContent>
  </AccordionItem>
</Accordion>




    </div>
  )
}

export default LandingPage
