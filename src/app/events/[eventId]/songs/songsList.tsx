'use client'

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

export default function SongsList({list}) {

    const songs = list;
    console.log(songs);
      return (<>
        <Table>
            <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody>
                <TableRow key="1">
                <TableCell>Tony Reichert</TableCell>
                <TableCell>CEO</TableCell>
                <TableCell>Active</TableCell>
                </TableRow>
                {songs.map}
            </TableBody>
        </Table>
        
        </>);
  }