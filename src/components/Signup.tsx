import { useState, ChangeEvent, useEffect } from 'react';
import Error from './error';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { BeatLoader } from 'react-spinners';
import * as Yup from 'yup';
import useFetch from '@/hooks/use-fetch';
import { signup } from '@/db/apiAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState<{ email: string; password: string, name: string, profile_pic: File | null}>({
      name: '',
      email: '',
      password: '',
      profile_pic: null
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
  
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");
  
    const { data, error: fetchError, loading, fn: fnSignup } = useFetch(signup, formData);
  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, files } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: files ? files[0] : value
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error for the field
    };
  
    useEffect(() => {
      if (fetchError === null && data) {
        navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      } else if (fetchError) {
        console.error('Login failed:', fetchError.message);
      }
    }, [data, fetchError]);
  
    const handleSignup = async () => {
      setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('name is required').min(2, "Name must be at least two characters"),
          email: Yup.string().email('Invalid Email').required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
          profile_pic: Yup.mixed().required('Profile picture is required'),
        });
  
        await schema.validate(formData, { abortEarly: false });
  
        await fnSignup(formData);
      } catch (validationErrors) {
        const newErrors: Record<string, string> = {};
        if (validationErrors instanceof Yup.ValidationError) {
          validationErrors.inner.forEach((err) => {
            if (err.path) newErrors[err.path] = err.message;
          });
        }
        setErrors(newErrors);
      }
    };
  
    return (
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>Create a new account if you haven't already</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">



            <div className="space-y-1">
              <Input
                name="name"
                type="text"
                placeholder="Enter name..."
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <Error message={errors.name} />}
            </div>


            <div className="space-y-1">
              <Input
                name="email"
                type="email"
                placeholder="Enter email..."
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <Error message={errors.email} />}
            </div>


            <div className="space-y-1">
              <Input
                name="password"
                type="password"
                placeholder="Enter password..."
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <Error message={errors.password} />}
            </div>


            <div className="space-y-1">
              <Input
                name="profile_pic"
                type="file"
                accept='image/*'

                onChange={handleInputChange}
              />
              {errors.profile_pic && <Error message={errors.profile_pic} />}
            </div>

            {fetchError && <Error message={fetchError.message} />} {/* Display fetch error */}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="text-white w-full" onClick={handleSignup} disabled={loading}>
              {loading ? <BeatLoader size={10} color="white" /> : 'Create Account'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

export default Signup