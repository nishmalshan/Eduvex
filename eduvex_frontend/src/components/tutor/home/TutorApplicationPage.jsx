// src/pages/user/tutor/TutorApplicationPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplication } from '../../../redux/features/tutorApplicationSlice';
import TutorApplicationForm from '../../../components/tutor/TutorApplicationForm';
import ApplicationUnderReview from '../../../components/common/layout/ApplicationUnderReview';
import Loader from '../../../components/common/layout/Loader';
import CourseTable from '../dashboard/Coursetable';

const TutorApplicationPage = () => {
  const dispatch = useDispatch();
  const { myApplication, hasApplied, loading } = useSelector(
    (state) => state.tutorApplications
  );
  console.log(myApplication, 'myApplication');

  useEffect(() => {
    dispatch(fetchMyApplication());
  }, [dispatch]);

  if (loading || hasApplied === null) return <Loader />;

  if (hasApplied && myApplication && myApplication.status === 'pending') {
    return <ApplicationUnderReview application={myApplication} />;
  } else if (hasApplied && myApplication && myApplication.status === 'rejected') {
    return <TutorApplicationForm />;
  } else if (hasApplied && myApplication && myApplication.status === 'approved') {
    return <CourseTable application={myApplication} />;
  }

  return <TutorApplicationForm />;
};

export default TutorApplicationPage;