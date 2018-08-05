Pulsante che espande e collassa i singoli WSP di una sottocentrale nella dashboard.
Quando è aperto deve contenere i [WSPDetailsButton](#wspdetailsbutton) dei WSP corrispondenti.

Chiuso:
```
<StructureDetailsButton handleClick={() => {}} />
```

Aperto:
```
<StructureDetailsButton handleClick={() => {}} isOpen>
  <WSPDetailsButton>
  <WSPDetailsButton>
</StructureDetailsButton>
```
