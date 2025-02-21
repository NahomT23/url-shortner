import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import Error from "@/components/error";    
import useFetch from "@/hooks/use-fetch";
import { useUrlState } from "@/context";
import { getClickForUrl } from "@/db/apiClicks";
import { getUrl, Url } from "@/db/apiUrls";
import { Click } from "@/db/apiClicks";
import LinkCard from "@/components/link-card";
import CreateLink from "@/components/create-link";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useUrlState();

  // Fetch URLs
  const fetchUrls = () => getUrl(user?.id || "");
  const {
    loading: loadingUrls,
    error: errorUrls,
    data: urls,
    fn: fetchUrlsFn,
  } = useFetch<Url[]>(fetchUrls);

  // Fetch clicks for URLs
  const fetchClicks = () =>
    getClickForUrl(urls?.map((url) => url.id) || []);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fetchClicksFn,
  } = useFetch<Click[]>(fetchClicks);

  // Fetch URLs on mount
  useEffect(() => {
    if (user?.id) {
      fetchUrlsFn();
    }
  }, [user?.id]);

  // Fetch clicks when URLs are loaded
  useEffect(() => {
    if (urls?.length) {
      fetchClicksFn();
    }
  }, [urls?.length]);

  // Filter URLs based on search query
  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Loader */}
      {(loadingUrls || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7bf" />
      )}

      {/* Cards Container */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Card className="ml-5">
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>

        <Card className="mr-5">
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Header Section */}
      <div className="flex justify-between">
        <h1 className="ml-5 text-4xl font-bold text-white">My Links</h1>
        {/* <Button variant="outline" className="text-white mr-5">
          Create Link
        </Button> */}
        <CreateLink/>
      </div>

      {/* Search Input */}
      <div className="relative m-5">
        <Input
          className="text-white"
          type="text"
          placeholder="Filter links"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1 text-white" />
      </div>

      {/* Error Handling */}
      {errorUrls && <Error message={errorUrls.message} />}

      {/* Display Filtered URLs */}
      <div className="m-5">
        {filteredUrls?.map((url, i) => (
          <LinkCard key={i} url={url} fetchUrls={fetchUrlsFn} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

