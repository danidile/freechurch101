"use client";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  CardFooter,
} from "@nextui-org/react";
import { basicUserData } from "@/utils/types/userData";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Tsections } from "@/utils/types/types";

export default function AddTeamForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<basicUserData>({
    // No resolver needed, only TypeScript type
  });

  const convertData = async () => {};
  const [teams, setTeams] = useState();
  const [state, setState] = useState<Tsections[]>([]);
  const AddSectionComponent = (key: React.Key) => {
    
  };
  const removeSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    
  };

  const AddSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.currentTarget as HTMLInputElement;
   
     

      
  };

  return (
    <div className="form-div crea-setlist-container">
      <form onSubmit={handleSubmit(convertData)}>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Crea Sezione</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Dynamic Actions"
            onAction={AddSectionComponent}
          >
            <DropdownItem key="Worship">Worship Team</DropdownItem>
            <DropdownItem key="Production">Production Team</DropdownItem>

            <DropdownItem key="Welcome">Welcome Team</DropdownItem>
            <DropdownItem key="Coffee">Coffee Team</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div>
          {teams && (
            <Card className="my-4">
              <CardBody className="flex-col gap-2">
                <h6>Worship Team </h6>

                {state.map((element, index) => {
                  return (
                    <div className="flex gap-4" key={"div" + index}>
                      <Input
                        name={"type" + element.key}
                        key={element.key}
                        className="hide-input"
                      />

                      <Input></Input>

                      <Button
                        size="sm"
                        className=" my-2"
                        isIconOnly
                        type="button"
                        variant="bordered"
                        id={element.key}
                        onClick={removeSection}
                        accessKey={String(index)}
                      >
                        <DeleteForeverOutlinedIcon />
                      </Button>
                    </div>
                  );
                })}
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  variant="flat"
                  type="button"
                  className="mr-0"
                  id="Canzone"
                  isIconOnly
                >
                  <AddIcon />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        {/* <Button
          color="primary"
          variant="shadow"
          className="mx-auto"
          type="submit"
          disabled={isSubmitting}
        >
          Add Song
        </Button> */}
      </form>
    </div>
  );
}
