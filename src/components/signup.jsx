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
import { signup } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  // longLink in case if we have a link given by the user that we want to shorten after they login
  const longLink = searchParams.get("createNew");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const { data, error, loading, fn: fnSignup } = useFetch(signup, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    // console.log(data);
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [error, loading]);

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invald Email").required("eEmail is Reqired"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is Reqired"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });   

      await schema.validate(formData, { abortEarly: false });
      //api call
      await fnSignup();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Create a new account if you haven&rsquo;t already
          </CardDescription>
          <Error message={errors.message} />
        </CardHeader>
        <CardContent className="space-y-2">
          {/* name */}
          <div className="space-y-1">
            <Input
              name="name"
              type="text"
              placeholder="Enter Name"
              onChange={handleInputChange}
            />
            {errors.name && <Error message={errors.name} />}
          </div>
          {/* email */}
          <div className="space-y-1">
            <Input
              name="email"
              type="email"
              placeholder="Enter Email"
              onChange={handleInputChange}
            />
            {errors.email && <Error message={errors.email} />}
          </div>
          {/* password */}
          <div className="space-y-1">
            <Input
              name="password"
              type="password"
              placeholder="Enter Password"
              onChange={handleInputChange}
            />
            {errors.password && <Error message={errors.password} />}
          </div>
          {/* profile-pic */}
          <div className="space-y-1">
            <Input
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
            />
            {errors.profile_pic && <Error message={errors.profile_pic} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup}>
            {loading ? (
              <BeatLoader size={10} color="#36d7b7" />
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
