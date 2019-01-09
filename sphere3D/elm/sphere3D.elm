import Browser
import Browser.Events exposing (onAnimationFrameDelta)
import Element
import Element.Background as Background
import Element.Font as Font
import Element.Input as Input
import Html exposing (Html, div)
import Html.Attributes exposing(height, style, width)
import Json.Decode exposing (Value)
import List exposing (concat, indexedMap, map, map2, range, repeat)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 as Vec3 exposing (vec3, Vec3)
import WebGL exposing (Mesh, Shader)


-- MAIN

type alias Model =
  { time : Float
  , color : Float -> Float -> Vec3
  , radius : Int
  , divLongitude : Int
  , divLatitude : Int
  }

type Msg
  = Delta Float
  | Marble
  | Gradation
  | DecreaseRadius
  | IncreaseRadius
  | DecreaseDivLatitude
  | IncreaseDivLatitude
  | DecreaseDivLongitude
  | IncreaseDivLongitude

main : Program () Model Msg
main =
  Browser.element
    { init = init
    , view = view
    , subscriptions = subscriptions
    , update = update
    }


-- INIT

init : () -> ( Model, Cmd Msg )
init _ =
  ( { time = 0
    , color = marble
    , radius = 5
    , divLongitude = 12
    , divLatitude = 6
    }
  , Cmd.none
  )


-- UPDATE

decrease : Int -> Int -> Int
decrease minVal val =
  max minVal (val - 1)

increase : Int -> Int -> Int
increase maxVal val =
  min maxVal (val + 1)

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Delta dt ->
      ( { model | time = model.time + dt / 5000 }, Cmd.none )

    Marble ->
      ( { model | color = marble }, Cmd.none )

    Gradation ->
      ( { model | color = gradation }, Cmd.none )

    DecreaseRadius ->
      ( { model | radius = decrease 1 model.radius }, Cmd.none )

    IncreaseRadius ->
      ( { model | radius = increase 7 model.radius }, Cmd.none )

    DecreaseDivLongitude ->
      ( { model | divLongitude = decrease 3 model.divLongitude }, Cmd.none )

    IncreaseDivLongitude ->
      ( { model | divLongitude = increase 36 model.divLongitude }, Cmd.none )

    DecreaseDivLatitude ->
      ( { model | divLatitude = decrease 2 model.divLatitude }, Cmd.none )

    IncreaseDivLatitude ->
      ( { model | divLatitude = increase 36 model.divLatitude }, Cmd.none )


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  let
    dt = model.time
  in
    onAnimationFrameDelta (\t -> Delta t)


-- VIEW

centerPosition : Float -> Float -> Float -> Vec3
centerPosition radius theta phi =
  vec3
    (radius * (cos <| degrees phi + theta))
    (radius * (sin <| degrees phi + theta))
    0

zeroPadding : Int -> String
zeroPadding number =
  let
    xs =
      if number > 9 then
        number :: []
      else
        0 :: number :: []
  in
    xs
      |> map String.fromInt
      |> String.concat

colorControlElement : String -> String -> String -> Msg -> String -> Msg -> String -> Element.Element Msg
colorControlElement filePath description value buttonMsg1 buttonLabel1 buttonMsg2 buttonLabel2 =
  Element.row
    [ Element.width Element.fill
    , Element.centerY
    , Element.spacing 5
    ]
    [ Element.column
        []
        [ Element.image
          [ Element.height Element.fill
          , Element.alignTop
          , Element.height <| Element.px <| 64
          , Element.width <| Element.px <| 64
          , Element.htmlAttribute (style "image-rendering" "pixelated")
          ]
          { src = filePath
          , description = description
          }
        , Element.el
            [ Element.width Element.fill
            , Element.centerX
            , Font.color (Element.rgb255 251 250 245)
            , Background.color (Element.rgb255 0 110 84)
            ]
            (Element.text value)
        ]
    , Element.column
        [ Element.alignTop
        , Element.spacing 5
        ]
        [ Input.button
            [ Element.width Element.fill
            , Font.color (Element.rgb255 251 250 245)
            , Background.color (Element.rgb255 0 110 84)
            , Element.padding 10
            ]
            { onPress = Just buttonMsg1, label = Element.text buttonLabel1 }
        , Input.button
            [ Element.width Element.fill
            , Font.color (Element.rgb255 251 250 245)
            , Background.color (Element.rgb255 0 110 84)
            , Element.padding 10
            ]
            { onPress = Just buttonMsg2, label = Element.text buttonLabel2 }
        ]
    ]
vertexControlElement : String -> String -> String -> Msg -> String -> Msg -> String -> Element.Element Msg
vertexControlElement filePath description value buttonMsg1 buttonLabel1 buttonMsg2 buttonLabel2 =
  Element.row
    [ Element.width Element.fill
    , Element.centerY
    , Element.spacing 5
    ]
    [ Element.column
        []
        [ Element.image
            [ Element.height <| Element.px <| 64
            , Element.width <| Element.px <| 64
            , Element.htmlAttribute (style "image-rendering" "pixelated")
            ]
            { src = filePath
            , description = description
            }
        , Element.el
            [ Element.width Element.fill
            , Element.centerX
            , Font.color (Element.rgb255 251 250 245)
            , Background.color (Element.rgb255 0 110 84)
            ]
            (Element.text value)
        ]
    , Element.column
        [ Element.alignTop
        , Element.spacing 5
        ]
        [ Input.button
            [ Element.width Element.fill
            , Font.color (Element.rgb255 251 250 245)
            , Background.color (Element.rgb255 0 110 84)
            , Element.padding 10
            ]
            { onPress = Just buttonMsg1, label = Element.text buttonLabel1 }
        , Input.button
            [ Element.width Element.fill
            , Font.color (Element.rgb255 251 250 245)
            , Background.color (Element.rgb255 0 110 84)
            , Element.padding 10
            ]
            { onPress = Just buttonMsg2, label = Element.text buttonLabel2 }
        ]
    ]

view : Model -> Html Msg
view model =
  let
    base =
      WebGL.entity
        vertexShader
        fragmentShader
        (sphere model.color (toFloat model.radius) model.divLongitude model.divLatitude)
  in
    div
      [ style "text-align" "center" ]
      [ WebGL.toHtml
          [ width 400
          , height 400
          , style "display" "block"
          ]
          [ base (uniforms (centerPosition 10.0 model.time 0) model.time)
          , base (uniforms (centerPosition 10.0 model.time 90.0) model.time)
          , base (uniforms (centerPosition 10.0 model.time 180.0) model.time)
          , base (uniforms (centerPosition 10.0 model.time 270.0) model.time)
          ]
      , Element.layout
          []
          (Element.row
            [ Element.alignTop
            , Element.spacing 20
            ]
            [ (colorControlElement "img/color.png" "Color" "Color" Marble "Marble" Gradation "Gradation")
            , (vertexControlElement "img/radius.png" "Radius" (zeroPadding model.radius) IncreaseRadius "↑" DecreaseRadius "↓")
            , (vertexControlElement "img/div_longitude.png" "DivLongitude" (zeroPadding model.divLongitude) IncreaseDivLongitude "↑" DecreaseDivLongitude "↓")
            , (vertexControlElement "img/div_latitude.png" "DivLatitude" (zeroPadding model.divLatitude) IncreaseDivLatitude "↑" DecreaseDivLatitude "↓")
            ]
          )
      ]


-- UNIFORMS

type alias Uniforms =
  { rotation : Mat4
  , perspective : Mat4
  , camera : Mat4
  , shade : Float
  }

uniforms : Vec3 -> Float -> Uniforms
uniforms origin theta =
  { rotation =
      Mat4.mul
        (Mat4.makeRotate (3 * theta) (vec3 0 0 1))
        (Mat4.makeRotate (4 * theta) (vec3 1 0 0))
          |> Mat4.mulAffine (Mat4.makeTranslate origin)
  , perspective = Mat4.makePerspective 45 1 10.0 100
  , camera = Mat4.makeLookAt (vec3 0 0 50) (vec3 0 0 0) (vec3 0 1 0)
  , shade = 0.8
  }


-- MESH

type alias Vertex =
  { color : Vec3
  , position : Vec3
  }

sphereX : Float -> Float -> Float
sphereX theta phi =
  (cos <| degrees <| theta) * (cos <| degrees <| phi)

sphereY : Float -> Float -> Float
sphereY theta phi =
  (sin <| degrees <| theta) * (cos <| degrees <| phi)

sphereZ : Float -> Float
sphereZ phi =
  sin <| degrees <| phi

toCC : Float -> Float -> Float -> Vec3
toCC r theta phi =
  vec3
    (r * (sphereX theta phi))
    (r * (sphereY theta phi))
    (r * (sphereZ phi))

gradation : Float -> Float -> Vec3
gradation theta phi =
  vec3
    ((sphereX theta phi + 1.0) / 2.0)
    ((sphereY theta phi + 1.0) / 2.0)
    ((sphereZ phi + 1.0) / 2.0)

marble : Float -> Float -> Vec3
marble theta phi =
  vec3
    ((cos theta * (cos phi) + 1.0) / 2.0)
    ((sin theta * (cos phi) + 1.0) / 2.0)
    ((sin phi + 1.0) / 2.0)

face : (Float -> Float -> Vec3) -> Float -> Int -> Int -> ( Int, Int ) -> List ( Vertex, Vertex, Vertex )
face color r m n (i, j) =
  let
    theta = toFloat i * 360.0 / (toFloat m)
    thetaNext = toFloat (i + 1) * 360.0 / (toFloat m)
    phi = toFloat j * 180.0 / (toFloat n) - 90.0
    phiNext = toFloat (j + 1) * 180.0 / (toFloat n) - 90.0
  in
    if j == 0 then
      [ ( (Vertex (color theta phi) (toCC r theta phi))
        , (Vertex (color thetaNext phiNext) (toCC r thetaNext phiNext))
        , (Vertex (color theta phiNext) (toCC r theta phiNext))
        )
      ]
    else if j < (n - 1) then
      [ ( (Vertex (color theta phi) (toCC r theta phi))
        , (Vertex (color thetaNext phi) (toCC r thetaNext phi))
        , (Vertex (color thetaNext phiNext) (toCC r thetaNext phiNext))
        )
      ,
        ( (Vertex (color thetaNext phiNext) (toCC r thetaNext phiNext))
        , (Vertex (color theta phiNext) (toCC r theta phiNext))
        , (Vertex (color theta phi) (toCC r theta phi))
        )
      ]
    else
      [ ( (Vertex (color thetaNext phiNext) (toCC r thetaNext phiNext))
        , (Vertex (color theta phi) (toCC r theta phi))
        , (Vertex (color thetaNext phi) (toCC r thetaNext phi))
        )
      ]

sphere : (Float -> Float -> Vec3) -> Float -> Int -> Int -> Mesh Vertex
sphere color r m n =
  let
    swap : ( Int, Int ) -> ( Int, Int )
    swap ( i, j ) =
      ( j, i )

    pair : List Int -> List ( Int, Int )
    pair xs =
      xs
        |> indexedMap Tuple.pair
        |> map swap

    position : List ( Int, Int )
    position =
      range 0 (m - 1)
        |> map (repeat n)
        |> map pair
        |> concat
  in
    map (face color r m n) position
      |> concat
      |> WebGL.triangles


-- SHADERS

vertexShader : Shader Vertex Uniforms { vcolor : Vec3}
vertexShader =
  [glsl|
    attribute vec3 position;
    attribute vec3 color;
    uniform mat4 rotation;
    uniform mat4 perspective;
    uniform mat4 camera;
    varying vec3 vcolor;
    void main () {
      gl_Position = perspective * camera * rotation * vec4(position, 1.0);
      vcolor = color;
    }
  |]

fragmentShader : Shader {} Uniforms { vcolor : Vec3 }
fragmentShader =
  [glsl|
    precision mediump float;
    uniform float shade;
    varying vec3 vcolor;
    void main () {
      gl_FragColor = shade * vec4(vcolor, 1.0);
    }
  |]
