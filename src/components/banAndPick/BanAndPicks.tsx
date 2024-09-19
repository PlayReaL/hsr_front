import styled, { keyframes } from "styled-components";
import {
  CharacterCard,
  CharacterCost,
  CharacterImage,
  CharactersCard,
  ConesForCharacters,
  RankForCharacters,
} from "@/styles/userStyles";
import { ICON_DEFAULT_URL } from "@/utils/ICON_DEFAULT_URL";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CharacterData } from "@/types/interface";
import { freeCharacter } from "@/common/freeCharacter";
import { useFetchTimer } from "@/fetch/fetch";
import { usePickTimer } from "@/utils/timer/pickTimer";

interface Props {
  charactersForFirstPlayer: CharacterData[];
  charactersForSecondPlayer: CharacterData[];
  bannedCharacters: CharacterData[];
  pickedCharacters: CharacterData[];
  currentPlayer: number;
  currentStage: "ban" | "pick" | null;
  globalStage: "ban" | "pick" | "ended" | null;
  currentPlayerForStyle: number;
  userUid: string | null;
  userNickname: string;
  penaltyTimer: number;
  isPickOrBan: boolean;

  setFirstPlayerFilteredCharacters: Dispatch<SetStateAction<CharacterData[]>>;
  setSecondPlayerFilteredCharacters: Dispatch<SetStateAction<CharacterData[]>>;
  setThirdPlayerFilteredCharacters: Dispatch<SetStateAction<CharacterData[]>>;
  setFourthPlayerFilteredCharacters: Dispatch<SetStateAction<CharacterData[]>>;
  setBannedCharacters: Dispatch<SetStateAction<CharacterData[]>>;
  setPickedCharacters: Dispatch<SetStateAction<CharacterData[]>>;
  setBanCount: Dispatch<SetStateAction<number>>;
  setPickCount: Dispatch<SetStateAction<number>>;
  setStage: Dispatch<SetStateAction<"ban" | "pick" | null>>;

  setPenaltyTimer: Dispatch<SetStateAction<number>>;
}

interface CharacterAction {
  charId: string;
  stage: "ban" | "pick";
  index: number;

  setStageCount: Dispatch<SetStateAction<number>>;
  setCharacterPickOrBanList: Dispatch<SetStateAction<CharacterData[]>>;
}

const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const BanAndPicks = ({
  charactersForFirstPlayer,
  charactersForSecondPlayer,
  bannedCharacters,
  pickedCharacters,
  setFirstPlayerFilteredCharacters,
  setSecondPlayerFilteredCharacters,
  setThirdPlayerFilteredCharacters,
  setFourthPlayerFilteredCharacters,
  setPickedCharacters,
  setBannedCharacters,
  setBanCount,
  setPickCount,
  setStage,
  currentPlayer,
  currentStage,
  currentPlayerForStyle,
  globalStage,
  userUid,
  userNickname,
  setPenaltyTimer,
  penaltyTimer,
  isPickOrBan,
}: Props) => {
  const [characterCost, setCharacterCost] = useState(0);
  const [pickNumber, setPickNumber] = useState(0);
  const [timer, setTimer] = useState(30);
  const [charactersArray, setCharactersArray] = useState<CharacterData[]>([]);

  const {
    data: timerData,
    isLoading: isTimerLoading,
    error: timerError,
  } = useFetchTimer();

  useEffect(() => {
    if (timerData && !isTimerLoading) {
      setTimer(timerData.mainTimer.minutes * 60 + timerData.mainTimer.seconds);
      setPenaltyTimer(
        timerData.penaltyTimer.minutes * 60 - timerData.penaltyTimer.seconds,
      );
    }
  }, [timerData, isTimerLoading, setPenaltyTimer]);

  const { totalTimer, currentTimer, timerReset } = usePickTimer({
    timer,
    setTimer,
    isPickStarted: isPickOrBan,
    penaltyTimer,
    setPenaltyTimer,
    timerData: timerData,
  });

  const findFirstPlayerCharacterById = (charId: string) => {
    return charactersForFirstPlayer.find(
      (character: CharacterData) => character.id === charId,
    );
  };

  const findSecondPlayerCharacterById = (charId: string) => {
    return charactersForSecondPlayer.find(
      (character: CharacterData) => character.id === charId,
    );
  };

  const emptyIcon = {
    id: "empty",
    rank: "",
    rarity: "",
    icon: null,
  };

  useEffect(() => {
    const mergedArray = [];
    let bannedIndex = 0;
    let pickedIndex = 0;

    if (bannedCharacters[bannedIndex]) {
      mergedArray.push(bannedCharacters[bannedIndex]);
      bannedIndex++;
    }

    for (let i = 0; i < 2; i++) {
      if (pickedCharacters[pickedIndex]) {
        mergedArray.push(pickedCharacters[pickedIndex]);
        pickedIndex++;
      }
    }

    if (bannedCharacters[bannedIndex]) {
      mergedArray.push(bannedCharacters[bannedIndex]);
      bannedIndex++;
    }

    for (let i = 0; i < 6; i++) {
      if (pickedCharacters[pickedIndex]) {
        mergedArray.push(pickedCharacters[pickedIndex]);
        pickedIndex++;
      }
    }

    setCharactersArray(mergedArray);
  }, [pickedCharacters, bannedCharacters]);

  useEffect(() => {
    if (currentPlayerForStyle === 1) {
      setPickNumber(1);
    } else {
      setPickNumber(2);
    }
  }, [currentPlayerForStyle]);

  const TOTAL_CHARACTERS_IN_PICK_AND_BAN = Array.from({ length: 20 }, (_, i) =>
    bannedCharacters[i] ? bannedCharacters[i] : emptyIcon,
  );

  const bannedIcons = Array.from({ length: 2 }, (_, i) =>
    bannedCharacters[i] ? bannedCharacters[i] : emptyIcon,
  );
  const pickedIcons = Array.from({ length: 8 }, (_, i) =>
    pickedCharacters[i] ? pickedCharacters[i] : emptyIcon,
  );

  const charactersIcons = Array.from({ length: 10 }, (_, i) =>
    charactersArray[i] ? charactersArray[i] : emptyIcon,
  );

  const onCharacterClick = ({
    charId,
    setCharacterPickOrBanList,
    setStageCount,
    stage,
    index,
  }: CharacterAction) => {
    setFirstPlayerFilteredCharacters((prevCharacters) => {
      const character = findFirstPlayerCharacterById(charId);
      if (!character) return prevCharacters;
      prevCharacters.filter((c) => c.id !== charId);
      if (charId === "8001") {
        prevCharacters.filter((c) => c.id !== "8002");
      }
      if (charId === "8002") {
        prevCharacters.filter((c) => c.id !== "8001");
      }
      if (charId === "8003") {
        prevCharacters.filter((c) => c.id !== "8004");
      }
      if (charId === "8004") {
        prevCharacters.filter((c) => c.id !== "8003");
      }
      if (charId === "8005") {
        prevCharacters.filter((c) => c.id !== "8006");
      }
      if (charId === "8006") {
        prevCharacters.filter((c) => c.id !== "8005");
      }

      return [...prevCharacters, character];
    });

    setSecondPlayerFilteredCharacters((prevCharacters) => {
      const character = findFirstPlayerCharacterById(charId);
      if (!character) return prevCharacters;
      prevCharacters.filter((c) => c.id !== charId);
      if (charId === "8001") {
        prevCharacters.filter((c) => c.id !== "8002");
      }
      if (charId === "8002") {
        prevCharacters.filter((c) => c.id !== "8001");
      }
      if (charId === "8003") {
        prevCharacters.filter((c) => c.id !== "8004");
      }
      if (charId === "8004") {
        prevCharacters.filter((c) => c.id !== "8003");
      }
      if (charId === "8005") {
        prevCharacters.filter((c) => c.id !== "8006");
      }
      if (charId === "8006") {
        prevCharacters.filter((c) => c.id !== "8005");
      }

      return [...prevCharacters, character];
    });

    setThirdPlayerFilteredCharacters((prevCharacters) => {
      const character = findSecondPlayerCharacterById(charId);
      if (!character) return prevCharacters;
      prevCharacters.filter((c) => c.id !== charId);
      if (charId === "8001") {
        prevCharacters.filter((c) => c.id !== "8002");
      }
      if (charId === "8002") {
        prevCharacters.filter((c) => c.id !== "8001");
      }
      if (charId === "8003") {
        prevCharacters.filter((c) => c.id !== "8004");
      }
      if (charId === "8004") {
        prevCharacters.filter((c) => c.id !== "8003");
      }
      if (charId === "8005") {
        prevCharacters.filter((c) => c.id !== "8006");
      }
      if (charId === "8006") {
        prevCharacters.filter((c) => c.id !== "8005");
      }

      return [...prevCharacters, character];
    });

    setFourthPlayerFilteredCharacters((prevCharacters) => {
      const character = findSecondPlayerCharacterById(charId);
      if (!character) return prevCharacters;
      prevCharacters.filter((c) => c.id !== charId);
      if (charId === "8001") {
        prevCharacters.filter((c) => c.id !== "8002");
      }
      if (charId === "8002") {
        prevCharacters.filter((c) => c.id !== "8001");
      }
      if (charId === "8003") {
        prevCharacters.filter((c) => c.id !== "8004");
      }
      if (charId === "8004") {
        prevCharacters.filter((c) => c.id !== "8003");
      }
      if (charId === "8005") {
        prevCharacters.filter((c) => c.id !== "8006");
      }
      if (charId === "8006") {
        prevCharacters.filter((c) => c.id !== "8005");
      }

      return [...prevCharacters, character];
    });

    setCharactersArray((prevCharacters) =>
      prevCharacters.filter((character) => character.id !== charId),
    );

    if (index === 0 || index === 3) {
      setBannedCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== charId),
      );
      setBanCount((prevState) => (prevState > 0 ? prevState - 1 : prevState));
      setStage("ban");
    } else {
      setPickedCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== charId),
      );
      setPickCount((prevState) => (prevState > 0 ? prevState - 1 : prevState));
      setStage("pick");
    }
  };

  if (isTimerLoading) return <div>Timer loading...</div>;

  return (
    <StyledPickAndBanContainer currentPlayer={currentPlayerForStyle}>
      <BanAndPickContainer currentPlayer={currentPlayerForStyle}>
        <BanSection currentPlayer={currentPlayerForStyle}>
          {charactersIcons.map((character, index) => (
            <div key={index}>
              {character.icon ? (
                <div>
                  {/*<StyledCharactersOperationSvg*/}
                  {/*  stage={currentStage}*/}
                  {/*  playerForStyle={currentPlayerForStyle}*/}
                  {/*  width="21"*/}
                  {/*  height="42"*/}
                  {/*  viewBox="0 0 21 42"*/}
                  {/*  fill="none"*/}
                  {/*  xmlns="http://www.w3.org/2000/svg"*/}
                  {/*>*/}
                  {/*  <path*/}
                  {/*    d="M21 0C9.40202 0 0 9.40202 0 21C0 32.598 9.40202 42 21 42V0Z"*/}
                  {/*    fill="#E31D1D"*/}
                  {/*  />*/}
                  {/*</StyledCharactersOperationSvg>*/}
                  <StyledCharactersBanCard
                    playerForStyle={currentPlayerForStyle}
                    index={index}
                  >
                    {/*<RankForPickedOrBannedCharacters2*/}
                    {/*  currentPlayer={currentPlayer}*/}
                    {/*>*/}
                    {/*  {character.rank}*/}
                    {/*</RankForPickedOrBannedCharacters2>*/}
                    <StyledPickedOrBannedCharacter
                      playerForStyle={currentPlayerForStyle}
                      characterRarity={character.rarity}
                      src={`${ICON_DEFAULT_URL}/${character.icon}`}
                      onError={(e) =>
                        (e.currentTarget.src = freeCharacter.icon)
                      }
                      onClick={() =>
                        onCharacterClick({
                          charId: character.id,
                          setCharacterPickOrBanList: setBannedCharacters,
                          setStageCount: setBanCount,
                          stage: "pick",
                          index: index,
                        })
                      }
                    />
                  </StyledCharactersBanCard>
                </div>
              ) : currentPlayerForStyle !== currentPlayer &&
                globalStage !== "pick" &&
                (index === 0 ||
                  (index === 3 && bannedCharacters.length === 1)) ? (
                <StyledDefaultPicksOrBans
                  playerForStyle={currentPlayerForStyle}
                >
                  <div className="flex">
                    <svg
                      width="15"
                      height="23"
                      viewBox="0 0 15 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M14.9487 0.135254H0V1.80599H2.19824V6.2467C2.19824 8.55762 3.6717 10.5244 5.73038 11.2588C3.6717 11.9932 2.19824 13.96 2.19824 16.2709V19.8322V20.7118H0V22.3825H14.9487V20.7118H12.8382V19.8322V16.2709C12.8382 13.96 11.3648 11.9932 9.30608 11.2588C11.3648 10.5244 12.8382 8.55762 12.8382 6.2467V1.80599H14.9487V0.135254ZM3.78105 16.2709V19.8322H11.2554V16.2709C11.2554 14.2069 9.58222 12.5337 7.51823 12.5337C5.45424 12.5337 3.78105 14.2069 3.78105 16.2709Z"
                        fill="white"
                      />
                    </svg>
                    {totalTimer}
                  </div>
                  <div>ban</div>
                </StyledDefaultPicksOrBans>
              ) : currentPlayerForStyle === currentPlayer &&
                currentStage === "pick" &&
                globalStage === "pick" &&
                index === pickedCharacters.length + bannedCharacters.length ? (
                <StyledDefaultPicksOrBans
                  playerForStyle={currentPlayerForStyle}
                >
                  <div className="flex">
                    <svg
                      width="15"
                      height="23"
                      viewBox="0 0 15 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M14.9487 0.135254H0V1.80599H2.19824V6.2467C2.19824 8.55762 3.6717 10.5244 5.73038 11.2588C3.6717 11.9932 2.19824 13.96 2.19824 16.2709V19.8322V20.7118H0V22.3825H14.9487V20.7118H12.8382V19.8322V16.2709C12.8382 13.96 11.3648 11.9932 9.30608 11.2588C11.3648 10.5244 12.8382 8.55762 12.8382 6.2467V1.80599H14.9487V0.135254ZM3.78105 16.2709V19.8322H11.2554V16.2709C11.2554 14.2069 9.58222 12.5337 7.51823 12.5337C5.45424 12.5337 3.78105 14.2069 3.78105 16.2709Z"
                        fill="white"
                      />
                    </svg>
                    {totalTimer}
                  </div>
                  pick
                </StyledDefaultPicksOrBans>
              ) : (
                <StyledDefaultPicksOrBans
                  playerForStyle={currentPlayerForStyle}
                >
                  {/*{index + 1}*/}
                </StyledDefaultPicksOrBans>
              )}
            </div>
          ))}
        </BanSection>

        {/*<StyledRow playerForStyle={currentPlayerForStyle} />*/}
        {/*<StyledPickSection currentPlayer={currentPlayerForStyle}>*/}
        {/*  <StyledUserNickname playerForStyle={currentPlayerForStyle}>*/}
        {/*    {userNickname}*/}
        {/*  </StyledUserNickname>*/}
        {/*  {pickedIcons.map((character, index) => (*/}
        {/*    <div key={index}>*/}
        {/*      {character.icon ? (*/}
        {/*        <StyledCharactersIcons playerForStyle={currentPlayerForStyle}>*/}
        {/*          <RankForPickedOrBannedCharacters*/}
        {/*            currentPlayer={currentPlayer}*/}
        {/*          >*/}
        {/*            {character.rank}*/}
        {/*          </RankForPickedOrBannedCharacters>*/}
        {/*          <StyledCharacterCard*/}
        {/*            playerForStyle={currentPlayerForStyle}*/}
        {/*            characterRarity={character.rarity}*/}
        {/*            src={`${ICON_DEFAULT_URL}/${character.icon}`}*/}
        {/*            onError={(e) => (e.currentTarget.src = freeCharacter.icon)}*/}
        {/*            onClick={() =>*/}
        {/*              onCharacterClick({*/}
        {/*                charId: character.id,*/}
        {/*                setCharacterPickOrBanList: setPickedCharacters,*/}
        {/*                setStageCount: setPickCount,*/}
        {/*                stage: "pick",*/}
        {/*              })*/}
        {/*            }*/}
        {/*          />*/}
        {/*          <StyledCharacterCost>*/}
        {/*            {character.rank === 0*/}
        {/*              ? character.cost*/}
        {/*              : character.rankCost[character.rank - 1]}*/}
        {/*          </StyledCharacterCost>*/}
        {/*          <UserCones*/}
        {/*            characterCone={character?.lightCone}*/}
        {/*            userUid={userUid}*/}
        {/*            currentPlayer={currentPlayerForStyle}*/}
        {/*            setCharactersForUser={setPickedCharacters}*/}
        {/*            characterId={character.id}*/}
        {/*          />*/}
        {/*        </StyledCharactersIcons>*/}
        {/*      ) : currentPlayerForStyle === currentPlayer &&*/}
        {/*        currentStage === "pick" &&*/}
        {/*        globalStage === "pick" &&*/}
        {/*        index === pickedCharacters.length ? (*/}
        {/*        <StyledAnimatedPicksOrBans*/}
        {/*          playerForStyle={currentPlayerForStyle}*/}
        {/*        >*/}
        {/*          /!*{index + 1}*!/*/}
        {/*        </StyledAnimatedPicksOrBans>*/}
        {/*      ) : (*/}
        {/*        <StyledDefaultPicksOrBans*/}
        {/*          playerForStyle={currentPlayerForStyle}*/}
        {/*        >*/}
        {/*          /!*{index + 1}*!/*/}
        {/*        </StyledDefaultPicksOrBans>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*  /!*{currentPlayer === 1 ? (*!/*/}
        {/*  /!*  <div style={{ color: "snow" }}>Arrow left</div>*!/*/}
        {/*  /!*) : (*!/*/}
        {/*  /!*  <div style={{ color: "snow" }}>Arrow right</div>*!/*/}
        {/*  /!*)}*!/*/}
        {/*</StyledPickSection>*/}
        {/*<StyledRow playerForStyle={currentPlayerForStyle} />*/}
      </BanAndPickContainer>
    </StyledPickAndBanContainer>
  );
};
const StyledCharactersOperationSvg = styled.svg<{
  playerForStyle: number;
  stage: "pick" | "ban";
}>`
  z-index: 99;
  position: absolute;
  display: flex;

  flex-direction: ${({ playerForStyle }) =>
    playerForStyle === 1 ? "row-reverse" : "row-reverse"};

  path {
    fill: ${({ stage }) => (stage === "ban" ? "#E31D1D" : "#00FF00")};
  }
`;

const StyledArrowContainer = styled.div`
  background-color: #acafff;
  height: 10px;

  width: 40px;
`;

const StyledRow = styled.div<{ playerForStyle: number }>`
  background-color: ${(props) =>
    props.playerForStyle === 1 ? "#ffa8a3" : "#acafff"};
  width: 100%;
  height: 2px;

  margin-top: 17px;
  margin-bottom: 13px;
  margin-left: -10px;
`;

const StyledPlayerBanAndPick = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledUserNickname = styled.div<{ playerForStyle: number }>`
  writing-mode: vertical-lr;
  text-orientation: upright;

  //margin-right: 10px;
  //margin-left: 10px

  color: ${(props) => (props.playerForStyle === 1 ? "#ffa8a3" : "#acafff")};

  justify-self: center;
  align-self: center;

  //height: 250px;
  height: 235px;

  word-break: break-word;
  white-space: normal;
  overflow: hidden;

  position: absolute;

  right: ${(props) => (props.playerForStyle === 1 ? "auto" : "0")};
  left: ${(props) => (props.playerForStyle === 1 ? "0" : "auto")};

  transform: ${(props) =>
    props.playerForStyle === 1 ? "translateX(-160%)" : "translateX(100%)"};
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 #ffee28;
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(116, 255, 118, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(116, 255, 118, 0);
  }
`;

const StyledArrowAnimateContainer = styled.div`
  background-color: #acafff;
  height: 10px;

  width: 50px;

  animation: ${pulseAnimation} 1.5s infinite ease-in-out;
`;

const StyledCharactersBanCard = styled(CharacterCard)<{
  playerForStyle: number;
  index: number;
}>`
  //width: 100px;
  //height: 100px;
  //position: relative;
  //margin: 10px 0;
  //border: 2px solid black;
  //filter: {({ isDisabled }) => (isDisabled ? "grayscale(100%)" : "none")};
  border-top-left-radius: ${({ playerForStyle }) =>
    playerForStyle === 1 && "10px"};
  border-top-right-radius: ${({ playerForStyle }) =>
    playerForStyle === 2 && "10px"};

  filter: ${({ index }) =>
    index === 0 || index === 3 ? "grayscale(100%)" : "none"};

  svg {
    filter: none;
  }

  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCharacterCost = styled(CharacterCost)`
  transform: translate(0%, -780%);

  font-size: 20px;
`;

const StyledCharacterCard = styled.img<{
  characterRarity: number;
  playerForStyle: number;
}>`
  width: 60px;
  height: 60px;

  background-color: ${(props) =>
    props.characterRarity === 4
      ? "rgba(128, 0, 128, 0.25)"
      : "rgba(207,181,59, 0.25)"};
  backdrop-filter: blur(12px);

  //border-radius: 50px;

  box-shadow: 0px 0px 5px 2px
    ${(props) =>
      props.characterRarity === 4 ? "#54458560" : "rgba(207,181,59, 0.25)"};

  border-top-left-radius: ${({ playerForStyle }) =>
    playerForStyle === 1 && "10px"};
  border-top-right-radius: ${({ playerForStyle }) =>
    playerForStyle === 2 && "10px"};
`;

const StyledPickAndBanContainer = styled.div<{ currentPlayer: number }>`
  //position: absolute;

  // --tw-translate-y: -50%;
  // transform: translate(var(--tw-translate-x), var(--tw-translate-y))
  //   rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
  //   scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  //
  // --tw-translate-x: -50%;
  //
  // left: 50%;
  //// top: ${(props) => (props.currentPlayer === 1 ? "420px" : "700px")};
`;

const StyledCharacterCone = styled(ConesForCharacters)<{
  currentPlayer: number;
}>`
  position: absolute;

  margin-top: 0;
  margin-left: 0;

  transform: translate(150%, -60%);
`;

const BanAndPickContainer = styled.section<{ currentPlayer: number }>`
  //gap: 25px;
  //width: 100%;
  margin-left: ${(props) => (props.currentPlayer === 1 ? "45%" : "-45%")};

  //margin-bottom: 2%;
  //direction: ${(props) => (props.currentPlayer === 1 ? "rtl" : "ltr")};

  //display: flex;
  //flex-direction: column;
`;

const RankForPickedOrBannedCharacters = styled(RankForCharacters)<{
  currentPlayer: number;
}>`
  position: absolute;

  z-index: 10;
  //margin-top: 3.9%;
  //margin-left: 0;

  transform: translate(460%, 3%);

  font-size: 20px;
`;

const RankForPickedOrBannedCharacters2 = styled(RankForCharacters)<{
  currentPlayer: number;
}>`
  //margin-top: 3.9%;
  //margin-left: 0;
  --tw-backdrop-blur: blur(12px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
    var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
    var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
    var(--tw-backdrop-sepia);

  z-index: 10;
  transform: translate(300%, -10%);

  font-size: 20px;
`;

const StyledPickSection = styled.div<{ currentPlayer: number }>`
  display: flex;
  flex-direction: column;

  gap: 10px;
  //flex-direction: {(props) =>
  //  props.currentPlayer === 1 ? "row" : "row-reverse"};
`;

const BanSection = styled.div<{ currentPlayer: number }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  width: 208px;
  justify-content: space-between;
  align-items: center;

  gap: 10px;

  //> :not([hidden]) ~ :not([hidden]) {
  //  --tw-space-x-reverse: 0;
  //  margin-right: calc(1rem * var(--tw-space-x-reverse));
  //  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  //}
  //
  //img {
  //  filter: grayscale(100%);
  //}
  //
  //.pulse-animation {
  //  animation: pulse 1.5s infinite;
  //  background-color: yellow;
  //}
  //
  //@keyframes pulse {
  //  0% {
  //    transform: scale(1);
  //    opacity: 1;
  //  }
  //  50% {
  //    transform: scale(1.1);
  //    opacity: 0.7;
  //  }
  //  100% {
  //    transform: scale(1);
  //    opacity: 1;
  //  }
  //}

  // margin-left: ${(props) => (props.currentPlayer === 1 ? "63%" : "0")};
`;

const StyledPickedOrBannedCharacter = styled(CharacterImage)<{
  playerForStyle: number;
  characterRarity: number;
}>`
  height: 60px;
  width: 158px;
  border: 3px solid white;

  --tw-backdrop-blur: blur(12px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
    var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
    var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
    var(--tw-backdrop-sepia);

  border-top-left-radius: ${({ playerForStyle }) =>
    playerForStyle === 1 ? "20px" : "0px"};
  border-top-right-radius: ${({ playerForStyle }) =>
    playerForStyle === 2 ? "20px" : "0xpx"};
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.9) 0px 18px 36px -18px inset;
`;

const StyledDefaultPicksOrBans = styled.div<{ playerForStyle: number }>`
  height: 60px;
  width: 158px;
  border: 3px solid rgb(255 255 255 / 0.15);
  //border-style: solid;
  //border-width: 1px;
  //border-color: rgb(255 255 255 / 0.15);
  //border-radius: 50px /* 6px */;
  background-color: rgb(241 245 249 / 0.05);

  //margin-right: 16px;

  --tw-backdrop-blur: blur(12px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
    var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
    var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
    var(--tw-backdrop-sepia);

  border-top-left-radius: ${({ playerForStyle }) =>
    playerForStyle === 1 && "20px"};
  border-top-right-radius: ${({ playerForStyle }) =>
    playerForStyle === 2 && "20px"};

  color: snow;
  display: flex;
  justify-content: space-between;
  align-items: end;

  padding-right: 10px;
  padding-left: 10px;
`;

const StyledDefaultPicksOrBansForBan = styled.div`
  height: 60px;
  width: 158px;
  border: 3px solid rgb(255 255 255 / 0.15);

  //border-radius: 50px;
  //border-style: solid;
  //border-width: 1px;
  //border-color: rgb(255 255 255 / 0.15);
  background-color: rgb(241 245 249 / 0.05);

  --tw-backdrop-blur: blur(12px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
    var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
    var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
    var(--tw-backdrop-sepia);
`;

const StyledAnimatedPicksOrBans = styled(StyledDefaultPicksOrBans)`
  animation: ${pulseAnimation} 1.5s infinite ease-in-out;
`;

const StyledAnimatedPicksOrBansForBan = styled(StyledDefaultPicksOrBansForBan)`
  animation: ${pulseAnimation} 1.5s infinite ease-in-out;
`;
