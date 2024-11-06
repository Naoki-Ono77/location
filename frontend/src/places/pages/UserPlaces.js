import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { userId } = useParams();  
 
  console.log('Fetched userId:', userId); // 取得した userId をログ出力
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!userId) {
        console.error("User ID is missing!");
        return; // userId が取得できない場合、処理を中断
      }

      console.log(`Fetching from URL: http://localhost:5000/api/places/user/${userId}`);


      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
        if (responseData.places) {
          console.log('Fetched Places:', responseData.places); // 取得した場所をログ出力
          setLoadedPlaces(responseData.places);
        } else {
          console.error("No places found in the response."); // placesが存在しない場合
        }
        } catch (err) {
          console.error("Error fetching places:", err.message || err); // エラーをログに出力
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

const placeDeletedHandler =(deletedPlaceId) => {
  setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !==deletedPlaceId));
};

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading &&(
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces &&<PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
    </React.Fragment>
  );
};

export default UserPlaces;
