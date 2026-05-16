"use client";
import { Link } from "@/i18n/navigation";
import { Card, CardFooter, Button } from "@heroui/react";

type Artist = {
  key: string;
  colSpan: string;
  name: string;
  cta: string;
};

export default function ArtistCards({ artists }: { artists: Artist[] }) {
  return (
    <div className="max-w-[1300px] gap-5 grid grid-cols-12 grid-rows-2 px-4 mx-auto my-5">
      {artists.map((artist) => (
        <Card
          key={artist.key}
          isFooterBlurred
          className={`${artist.colSpan} h-[400px]`}
        >
          <img
            className="object-cover h-[400px]"
            src={`images/${artist.key}.webp`}
            alt={artist.name}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border overflow-hidden py-1 pr-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%-8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">{artist.name}</p>
            <Button
              className="text-tiny text-white bg-black/20 mr-0"
              color="default"
              radius="md"
              size="sm"
              variant="light"
              as={Link}
              href={`/artists/${artist.key}`}
            >
              {artist.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}