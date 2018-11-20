<?php

/* transactions.html */
class __TwigTemplate_8206b29a376db1071c2401c2915fa6e1954cc80355ed58503e61e3deed5ebb72 extends Twig_Template
{
    private $source;

    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        // line 1
        $this->parent = $this->loadTemplate("layout.html", "transactions.html", 1);
        $this->blocks = array(
            'staticlinks' => array($this, 'block_staticlinks'),
            'content' => array($this, 'block_content'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "layout.html";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 2
    public function block_staticlinks($context, array $blocks = array())
    {
    }

    // line 6
    public function block_content($context, array $blocks = array())
    {
        // line 7
        echo "    
    <section class=\"container-fluid\">
        <div class=\"row justify-content-md-center my-5\">
            <div class=\"col-md-12\" id=\"tsChart\"></div>
        </div>
    </section>
    
    <section class=\"container-fluid\">
        <div class=\"row justify-content-md-center my-2\">
            <table class=\"col-md-12 w-100\" id=\"tsTable\"></table>
        </div>
    </section>
        
";
    }

    public function getTemplateName()
    {
        return "transactions.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  41 => 7,  38 => 6,  33 => 2,  15 => 1,);
    }

    public function getSourceContext()
    {
        return new Twig_Source("{% extends \"layout.html\" %}
{% block staticlinks %}
{% endblock %}


{% block content %}
    
    <section class=\"container-fluid\">
        <div class=\"row justify-content-md-center my-5\">
            <div class=\"col-md-12\" id=\"tsChart\"></div>
        </div>
    </section>
    
    <section class=\"container-fluid\">
        <div class=\"row justify-content-md-center my-2\">
            <table class=\"col-md-12 w-100\" id=\"tsTable\"></table>
        </div>
    </section>
        
{% endblock %}", "transactions.html", "/var/www/budget.charlesye.me/public/templates/transactions.html");
    }
}
