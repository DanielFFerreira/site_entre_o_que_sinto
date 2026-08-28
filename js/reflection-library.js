const reflections = [
  ["Eu gosto dela?", "Sim. Tenho um sentimento muito grande pela Juliane, gosto da nossa proximidade e percebo o peso emocional que ela tem para mim.", "sentimento"],
  ["Eu ainda amo ela?", "Sinto que existe amor, misturado à nossa história, ao carinho, à esperança e ao desejo de reconstrução. Ainda quero entender melhor como amo quem ela é hoje.", "sentimento"],
  ["Eu quero voltar com ela?", "Sim. Se houver vontade verdadeira dos dois lados e condições saudáveis, gostaria de construir algo novamente. Meu desejo não determina o dela.", "sentimento"],
  ["Eu sei se vamos voltar?", "Não. Há aproximação, conversa e carinho, mas isso não basta para afirmar uma reconciliação. O futuro continua aberto.", "incerteza"],
  ["Eu sei o que ela sente?", "Não completamente. Posso observar o que ela demonstra e diz, mas não tenho acesso ao mundo interno dela.", "incerteza"],
  ["Existe carinho dela por mim?", "Reconheço comportamentos concretos de carinho, iniciativa e proximidade. Isso não permite concluir automaticamente que exista intenção de relacionamento.", "realidade"],
  ["Então ela quer namorar comigo?", "Não posso afirmar. Ela já disse que não pretende namorar neste momento, e preciso respeitar essa posição enquanto ela não disser algo diferente.", "realidade"],
  ["Por que fico tão feliz quando ela me procura?", "Porque ela importa para mim e a iniciativa dela mostra que a aproximação não dependeu só de mim. Posso receber essa alegria sem usá-la como resposta sobre o futuro.", "sentimento"],
  ["Por que uma mensagem pequena pode significar tanto?", "Porque quem enviou não é emocionalmente neutra para mim. A mensagem toca memórias, expectativa, esperança e medo.", "sentimento"],
  ["Por que analiso tanto as mensagens?", "Porque tento encontrar nelas uma certeza que a situação ainda não oferece. Às vezes organizo fatos; outras vezes ultrapasso os fatos e tento adivinhar sentimentos.", "incerteza"],
  ["Por que quero saber o significado de tudo?", "Porque uma explicação diminui temporariamente a incerteza. Mas uma explicação criada por mim não vira verdade só porque me tranquilizou.", "incerteza"],
  ["Por que fico ansioso quando não tenho resposta?", "Porque desejo um resultado e, enquanto não sei se acontecerá, preencho a espera com possibilidades e expectativa.", "incerteza"],
  ["Por que quero perguntar novamente?", "Porque uma nova pergunta parece capaz de encerrar a incerteza, mesmo quando não existe informação nova. Às vezes tenho apenas dificuldade de esperar.", "incerteza"],
  ["Por que reviso uma mensagem depois de enviar?", "Porque já não controlo como ela será recebida. Posso procurar um erro antes de existir qualquer evidência de que algo deu errado.", "incerteza"],
  ["Eu tenho medo de falar errado?", "Sim, principalmente quando a conversa envolve alguém muito importante para mim e temo prejudicar uma aproximação que valorizo.", "sentimento"],
  ["Por que quero corrigir uma mensagem?", "Porque corrigir parece devolver controle. Quero verificar primeiro se realmente existe algo para reparar.", "incerteza"],
  ["Por que quero pedir desculpas sem saber se fiz algo?", "Talvez eu confunda a possibilidade de ter causado desconforto com a certeza de que causei e procure a confirmação de que está tudo bem.", "incerteza"],
  ["Tenho que pedir desculpas por demonstrar interesse?", "Não por demonstrá-lo respeitosamente. Preciso pedir desculpas se ultrapassar um limite, pressionar, desrespeitar ou machucar.", "limites"],
  ["Por que fico vulnerável depois de fazer um convite?", "Porque, depois do convite, existe outra pessoa escolhendo. Posso receber sim, não, talvez ou precisar esperar.", "sentimento"],
  ["Por que ser escolhido por ela importa tanto?", "Porque existe sentimento, história, esperança e vontade de reciprocidade. Ainda quero investigar quanto existe também de necessidade de validação.", "sentimento"],
  ["Ser escolhido define meu valor?", "Não. Uma resposta dela fala do que ela sente e deseja, não de todo o meu valor, embora eu reconheça que uma rejeição poderia me machucar.", "realidade"],
  ["Tenho medo de rejeição?", "Sim. Existe medo de receber uma resposta diferente daquela que desejo. Quero compreender como ele influencia minhas atitudes, sem transformá-lo em diagnóstico.", "sentimento"],
  ["Por que o não saber é tão difícil?", "Porque mantém várias possibilidades abertas e minha cabeça tenta fechá-las criando explicações. Algumas respostas realmente ainda não existem.", "incerteza"],
  ["O silêncio significa rejeição?", "Não necessariamente. Significa apenas ausência de resposta naquele intervalo; não devo convertê-lo automaticamente em rejeição nem em esperança.", "realidade"],
  ["Carinho significa promessa?", "Não. Posso reconhecer e valorizar carinho sem exigir que ele carregue uma promessa sobre o futuro.", "realidade"],
  ["A indefinição significa que ela está brincando comigo?", "Não tenho fundamento para afirmar isso. Posso me frustrar com a indefinição sem atribuir uma intenção negativa a ela.", "realidade"],
  ["Posso ficar frustrado com ela?", "Sim. Minha frustração é real, mas sentimento e acusação são coisas diferentes; ela não prova intenção de me machucar.", "sentimento"],
  ["Posso ficar com raiva?", "Sim. Não preciso fingir serenidade, mas não quero transformar tudo o que penso durante a raiva em verdade ou ação.", "sentimento"],
  ["Por que quando fico revoltado quero falar tudo?", "Porque fico cansado de pensar e esperar, e falar tudo parece encerrar o que está aberto. Nesse impulso, fatos, medos e acusações podem se misturar.", "limites"],
  ["Por que posso querer falar coisas sem prova?", "Na revolta, uma hipótese pode parecer convincente e posso querer mostrar a intensidade do que sinto. Posso escrever sem transformar a hipótese em acusação enviada.", "limites"],
  ["Por que penso em bloquear?", "Ainda não existe uma única resposta. Pode ser vontade de interromper o desconforto, cansaço ou necessidade de distância; quero distinguir limite de fuga.", "limites"],
  ["Se quero uma resposta, por que às vezes quero bloquear?", "Uma parte quer saber e outra se cansa de esperar. Bloquear pode parecer controle quando não controlo o resultado; quero discutir isso na terapia.", "limites"],
  ["Quero bloquear para ela sentir minha falta?", "Não quero usar bloqueio assim. Se eu desejar provocar uma reação, isso será um sinal para não confundir limite com teste.", "limites"],
  ["Por que às vezes quero parar de falar com ela?", "Porque a incerteza, a expectativa e a quantidade de pensamentos podem me deixar emocionalmente cansado. A distância parece oferecer descanso.", "limites"],
  ["Eu realmente quero parar de falar com ela?", "Hoje não consigo dizer que sim. Tranquilo, gosto da proximidade; a vontade cresce quando estou frustrado, mas também pode indicar um limite a compreender.", "limites"],
  ["O que quero dizer com ‘não quero ser palhaço’?", "Que não quero investir indefinidamente mais do que consigo sustentar nem construir sozinho algo que precisaria de duas pessoas. Também reconheço a raiva nessa frase.", "limites"],
  ["Estou sendo palhaço?", "Não consigo concluir isso pelos fatos. Demonstrar carinho e fazer um convite não significam isso; preciso observar meus limites e a reciprocidade ao longo do tempo.", "realidade"],
  ["Estou correndo atrás sozinho?", "Não completamente. Ela também inicia conversas, retoma assuntos e compartilha coisas. Quero observar o conjunto, especialmente encontros, sem fazer de um episódio a resposta inteira.", "realidade"],
  ["Devo diminuir minha iniciativa?", "Pode ser saudável se estou oferecendo mais energia do que sustento, mas não como técnica para provocar falta. Quero recuperar equilíbrio e abrir espaço para reciprocidade espontânea.", "limites"],
  ["Devo sumir?", "Não como estratégia. Se eu realmente precisar de distância, posso escolhê-la; isso é diferente de desaparecer esperando uma reação.", "limites"],
  ["Devo bloquear?", "Neste momento não vejo razão concreta. Posso reconsiderar se precisar preservar um limite real, mas não quero decidir durante uma revolta.", "limites"],
  ["Devo continuar falando com ela?", "Hoje ainda quero manter contato sem transformar cada interação em avaliação do futuro, observando também meus limites e o efeito dessa aproximação em mim.", "limites"],
  ["Eu conseguiria ser apenas amigo?", "Minha resposta hoje é: ainda não sei. Tenho sentimentos e esperança além de uma amizade neutra e preciso observar, com tempo, o que consigo sustentar.", "incerteza"],
  ["Até quando devo esperar?", "Não tenho uma data. Esperar não pode suspender minha vida; quero pensar o limite pelo efeito da situação em mim, não apenas por dias.", "limites"],
  ["Respeitar o tempo dela significa esperar para sempre?", "Não. Ela tem direito ao tempo e às escolhas dela, e eu também tenho direito aos meus limites.", "limites"],
  ["Preciso tomar uma decisão agora?", "Não. Posso observar, conversar na terapia e decidir com mais informação e menos intensidade emocional.", "limites"],
  ["O que o episódio do bolo mostrou?", "Mostrou que revisei meu convite e imaginei desconforto sem evidência. Depois ela retomou o assunto espontaneamente; isso não garante convite, mas não confirmou meu medo.", "realidade"],
  ["O que aprendi com o bolo?", "Que às vezes interpreto antes de uma situação terminar. Quando espero, a realidade pode acrescentar informações que eu ainda não tinha.", "realidade"],
  ["Então sempre devo esperar?", "Não. Às vezes conversar ou estabelecer limite é necessário. Quero diferenciar comunicação real da ação usada apenas para acabar rapidamente com a ansiedade.", "limites"],
  ["Por que ela retomar o assunto foi importante para mim?", "Porque trouxe uma informação incompatível com algumas conclusões negativas que eu criava e porque fiquei feliz com a iniciativa dela.", "realidade"],
  ["Isso significa que ela vai me convidar?", "Não. Ela disse que avisaria; isso é tudo o que posso afirmar até que a realidade acrescente outra informação.", "realidade"],
  ["Por que quero tanto que ela me convide?", "Porque quero vê-la e compartilhar um momento simples. Ser convidado também poderia significar proximidade e escolha para mim, mas um café não responde toda a relação.", "sentimento"],
  ["O que está nas minhas mãos?", "Minha fala, meu respeito, minha sinceridade, minha rotina, meus limites, minhas escolhas e a forma como cuido do que sinto.", "limites"],
  ["O que não está nas minhas mãos?", "O sentimento, a resposta e o tempo dela; se desejará relacionamento, se convidará e qual será nosso futuro. Não construo reciprocidade sozinho.", "realidade"],
  ["O que significa reciprocidade para mim?", "Movimento dos dois lados: iniciativa, interesse, disponibilidade, vontade de estar perto, capacidade de propor e, numa relação, escolha dos dois. Não é contagem de mensagens.", "realidade"],
  ["Quero controlar o resultado?", "Em alguns momentos percebo vontade de obter garantia. Quero notar quando estou cuidando da situação e quando tento controlar o que não depende só de mim.", "incerteza"],
  ["O que é amar sem controlar?", "É desejar muito e ainda reconhecer a liberdade da outra pessoa. Quero que qualquer escolha dela seja verdadeira, inclusive quando não for a que desejo.", "sentimento"],
  ["O que significa respeitar a verdade dela?", "Dar ao que ela diz sobre os próprios sentimentos mais autoridade do que às minhas interpretações, seja a resposta sim, não ou não sei.", "realidade"],
  ["E a minha verdade?", "Também importa. Gosto dela, tenho esperança, quero proximidade, sinto emoções diferentes e tenho limites. Respeitar a liberdade dela não exige me apagar.", "sentimento"],
  ["Qual é meu maior desafio agora?", "Talvez seja viver essa aproximação sem fazer de cada momento uma resposta sobre o futuro e suportar a incerteza sem abandonar meus limites.", "incerteza"],
  ["O que quero levar para a terapia?", "Quero compreender minha relação com incerteza, mensagens, validação, ansiedade, revolta, bloqueio e limites, aprendendo a reconhecer reciprocidade sem inventá-la.", "incerteza"],
  ["O que quero para mim, independentemente do resultado?", "Quero viver com dignidade, respeito e sinceridade, manter minha vida, receber um sim sem euforia, atravessar um não e conviver com um não sei.", "limites"],
  ["Se ela não me escolher, tudo foi em vão?", "Não quero que seja. Eu ficaria triste, mas o que aprendo sobre sentimentos, limites e minha forma de me relacionar continua tendo valor.", "realidade"],
  ["Se ela me escolher, todos os problemas desaparecem?", "Não. Uma relação não resolveria automaticamente minha ansiedade ou necessidade de certeza; quero trabalhar isso em mim.", "realidade"],
  ["O que quero que aconteça?", "Gostaria que a aproximação continuasse e que pudéssemos construir algo com reciprocidade, liberdade e vontade dos dois. É esperança, não previsão.", "sentimento"],
  ["O que preciso aceitar?", "Que pode acontecer, não acontecer ou demorar; que ela tem liberdade e eu também; e que não preciso destruir o presente tentando obrigá-lo a contar o futuro.", "realidade"],
];

const list = document.querySelector("#completeAnswers");
const filters = document.querySelectorAll("[data-answer-filter]");

function renderReflections(filter = "todas") {
  if (!list) return;
  const visible = reflections.filter(([, , category]) => filter === "todas" || category === filter);
  list.innerHTML = visible.map(([question, answer, category], index) => `
    <details class="complete-answer" data-category="${category}">
      <summary><span>${String(index + 1).padStart(2, "0")}</span><h3>${question}</h3><i class="ri-add-line" aria-hidden="true"></i></summary>
      <div><small>Minha resposta hoje</small><p>${answer}</p></div>
    </details>
  `).join("");
}

filters.forEach((button) => button.addEventListener("click", () => {
  filters.forEach((item) => item.classList.toggle("is-active", item === button));
  renderReflections(button.dataset.answerFilter);
}));

renderReflections();
