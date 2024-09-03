import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./ui/error";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { login } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

const Login = () => {   
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  // longLink in case if we have a link given by the user that we want to shorten after they login
  const longLink = searchParams.get("createNew");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { data, error, loading, fn:fnLogin } = useFetch(login, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    console.log(data);
    if (error === null && data) {
        navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
        fetchUser();

    }
  }, [data, error])
  

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Invald Email").required("eEmail is Reqired"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is Reqired"),
      });

      await schema.validate(formData, { abortEarly: false });
      //api call
      await fnLogin()

    } catch (e) {
        const newErrors = {}

        e?.inner?.forEach((err) => {
            newErrors[err.path] = err.message; 
        })

        setErrors(newErrors);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            to your account if you already have one
          </CardDescription>
          <Error message={errors.message} />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input
              name="email"
              type="email"
              placeholder="Enter Email"
              onChange={handleInputChange}
            />
           {errors.email &&  <Error message={errors.email} />}
          </div>
          <div className="space-y-1">
            <Input
              name="password"
              type="password"
              placeholder="Enter Password"
              onChange={handleInputChange}
            />
            {errors.password && <Error message={errors.password} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin}>
            {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
